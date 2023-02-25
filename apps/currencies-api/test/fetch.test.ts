import type { currencies } from "@all-track/currencies";
import { vi, it, expect } from "vitest";
import { fetchCurrencies } from "../fetch";

type ValidData = {
  [K in typeof currencies[number]['symbol']]: {
    code: K;
    value: number;
  };
}

// Use subset of valid currencies
vi.mock('@all-track/currencies');

const url = 'http://currencies.test';
const key = 'test';

const date = '2023-02-24T00:00:00.000Z';

const createValidRatesData = () => ({
  meta: {
    last_updated_at: date,
  },
  data: {
    EUR: { code: 'EUR', value: 0.9 },
    USD: { code: 'USD', value: 1 },
  } satisfies Partial<ValidData> as Record<string, { code: string, value: number }>,
});

const createValidData = (): Awaited<ReturnType<typeof fetchCurrencies>> => ({
  lastUpdated: new Date(date),
  currencies: {
    EUR: {
      symbol: 'EUR',
      code: 978,
      displayName: 'Euro',
      name: 'Euro',
      sign: '€',
      units: 2,
      rate: 0.9,
    },
    USD: {
      symbol: 'USD',
      code: 840,
      displayName: 'US Dollar',
      name: 'US Dollar',
      sign: '$',
      units: 2,
      rate: 1,
    },
  }
});

const createFetchMock = (status: number, data: unknown) => {
  const mock = getMiniflareFetchMock();
  mock.disableNetConnect();

  mock.get(url)
    .intercept({ method: 'GET', path: `/?apiKey=${key}` })
    .replyContentLength()
    .reply(status, JSON.stringify(data));
}

it('should return valid currencies when all keys are present in response', async () => {
  const rates = createValidRatesData();
  rates.data['GBP'] = { code: 'GBP', value: 1.1 };
  createFetchMock(200, rates);

  const result = await fetchCurrencies(url, key);

  const validResult = createValidData();
  expect(result).toMatchObject(validResult)
});

it('should throw when invalid api response', async () => {
  createFetchMock(200, {});

  await expect(async () => await fetchCurrencies(url, key))
    .rejects.toThrowError();
});

it('should throw on missing keys in response', async () => {
  const rates = createValidRatesData();
  delete rates.data['USD'];
  createFetchMock(200, rates);

  await expect(async () => await fetchCurrencies(url, key))
    .rejects.toThrowError(new Error('Currency USD not found in response'));
});

it('should throw on unauthorized', async () => {
  createFetchMock(401, {});

  await expect(async () => await fetchCurrencies(url, key))
    .rejects.toThrowError(new Error('Invalid response status: 401'));
});
