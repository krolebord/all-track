import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { getLastStoredCurrencyData } from "@all-track/currencies-store/server";
import { mockFetchCurrencies, mockDate, mockCurrenciesWithRate, env, createScheduledEvent } from "./index.test.mocks";

const describe = setupMiniflareIsolatedStorage();

const expectEmptyKV = async (kv: KVNamespace) => {
  const keys = await kv.list();
  expect(keys.keys).toHaveLength(0);
};

vi.mock('~/fetch', async () => {
  return ({
    fetchCurrencies: mockFetchCurrencies,
  } as typeof import('~/fetch'));
});

let api: typeof import('../index')['default'];

beforeAll(async () => {
  api = (await import('../index')).default;
});

afterEach(() => {
  vi.clearAllMocks()
});

it('should not call external api when env is invalid', async () => {
  const invalidEnv: typeof env = {
    CURRENCIES_KV: env.CURRENCIES_KV,
    CURRENCIES_API_KEY: null!,
    CURRENCIES_API_URL: null!,
  }

  const response = await api.fetch(new Request('http://example.com'), invalidEnv);
  expect(response.status).toBe(500);
  expect(mockFetchCurrencies).toHaveBeenCalledTimes(0);
});

describe('with empty store', () => {
  beforeEach(async () => {
    await expectEmptyKV(env.CURRENCIES_KV);
  });

  it('cron should fetch currencies from external api and store them', async () => {
    await api.scheduled(createScheduledEvent(mockDate), env);

    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);

    const stored = await getLastStoredCurrencyData(env.CURRENCIES_KV);
    expect(stored.currencies).toEqual(mockCurrenciesWithRate);
  });

  it('fetch should return 404 when requesting specific date', async () => {
    const response = await api.fetch(new Request('http://example.com?date=2021-01-01'), env);

    expect(mockFetchCurrencies).toHaveBeenCalledTimes(0);

    expect(response.status).toBe(404);
  });

  it('fetch should get currencies from external api and store them', async () => {
    const response = await api.fetch(new Request('http://example.com'), env);

    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      lastUpdated: mockDate.toISOString(),
      currencies: mockCurrenciesWithRate,
    });

    const stored = await getLastStoredCurrencyData(env.CURRENCIES_KV);
    expect(stored.currencies).toEqual(mockCurrenciesWithRate);
  });

  it('on subsequent fetch should return the latest stored currencies', async () => {
    await api.fetch(new Request('http://example.com'), env);
    const response = await api.fetch(new Request('http://example.com'), env);

    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      lastUpdated: mockDate.toISOString(),
      currencies: mockCurrenciesWithRate,
    });
  });

  it('should return 500 when currencies cant be fetched', async () => {
    const invalidEnv = {
      ...env,
      CURRENCIES_API_KEY: 'invalid',
    }

    const response = await api.fetch(new Request('http://example.com'), invalidEnv);

    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(500);
  });
});

describe('with cron triggered', () => {
  beforeAll(async () => {
    await api.scheduled(createScheduledEvent(mockDate), env);
    vi.resetAllMocks();
  });

  it('fetch should return the latest stored currencies', async () => {
    const response = await api.fetch(new Request('http://example.com'), env);
  
    expect(mockFetchCurrencies).toBeCalledTimes(0);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      lastUpdated: mockDate.toISOString(),
      currencies: mockCurrenciesWithRate,
    });
  });

  it('fetch should return 404 for invalid date', async () => {
    const response = await api.fetch(new Request(`http://example.com/?date=hello`), env);
  
    expect(mockFetchCurrencies).toBeCalledTimes(0);

    expect(response.status).toBe(400);
  });

  it('fetch should return 404 for missing date', async () => {
    const response = await api.fetch(new Request(`http://example.com/?date=2020-2-2`), env);
  
    expect(mockFetchCurrencies).toBeCalledTimes(0);

    expect(response.status).toBe(404);
  });

  it('fetch should return stored currencies for specific date', async () => {
    const response = await api.fetch(new Request(`http://example.com/?date=${mockDate.toISOString()}`), env);
  
    expect(mockFetchCurrencies).toBeCalledTimes(0);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      lastUpdated: mockDate.toISOString(),
      currencies: mockCurrenciesWithRate,
    });
  });
});
