import { vi } from "vitest";
import { fetchCurrencies } from "~/fetch";
import { Env } from "..";

const { CURRENCIES_KV } = getMiniflareBindings() as Env;

export const env: Env = {
  CURRENCIES_KV,
  CURRENCIES_API_KEY: 'test',
  CURRENCIES_API_URL: 'http://hello.test'
}

export const mockDate = new Date('2023-02-24');

export const mockCurrenciesWithRate = {
  'USD': {
    name: 'US Dollar',
    code: 840,
    displayName: 'US Dollar',
    rate: 1,
    sign: '$',
    symbol: 'USD',
    units: 2,
  },
  'EUR': {
    name: 'Euro',
    code: 978,
    displayName: 'Euro',
    rate: 0.9,
    sign: '€',
    symbol: 'EUR',
    units: 2,
  }
} as const;

export const createScheduledEvent = (date: Date) => ({
  scheduledTime: date.getTime(),
} satisfies Partial<ScheduledEvent> as ScheduledEvent);

const fetchCurrenciesMockImplementation: typeof fetchCurrencies = async (_, key: string) => {
  if (key !== 'test') {
    throw new Error('Invalid API key');
  }
  
  return ({
    lastUpdated: mockDate,
    currencies: mockCurrenciesWithRate
  });
};

export const mockFetchCurrencies = vi.fn(fetchCurrenciesMockImplementation);
