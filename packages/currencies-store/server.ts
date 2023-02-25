import type { CurrencyData } from ".";
import { createKvJsonStore } from "./kv-store";

type StoredCurrencyMetadata = {
  lastUpdated: string;
}

type StoredCurrencies = CurrencyData['currencies'];

export const latestCurrencyDataKey = 'currencies:latest';

export const currencyDataKey = (date: Date) => {
  return `currencies:${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
};

const { put, get } = createKvJsonStore<StoredCurrencies, StoredCurrencyMetadata>();

type SaveCurrencyDataOptions = {
  overrideLatest: boolean;
  date: Date;
  data: CurrencyData;
  kv: KVNamespace;
}
export const storeCurrencyData = async (options: SaveCurrencyDataOptions) => {
  const { kv, data, overrideLatest, date } = options;

  const metadata = { lastUpdated: data.lastUpdated.toISOString() };
  
  const promises = [
    put(kv, currencyDataKey(date), data.currencies, metadata)
  ];

  if (overrideLatest) {
    promises.push(put(kv, latestCurrencyDataKey, data.currencies, metadata));
  }

  await Promise.allSettled(promises);
}

export const getStoredCurrencyData = async (kv: KVNamespace, key: string): Promise<CurrencyData | null> => {
  const result = await get(kv, key);

  if (!result?.data || !result?.meta?.lastUpdated) {
    return null;
  }

  return {
    lastUpdated: new Date(result.meta.lastUpdated),
    currencies: result.data
  };
}

export const getLastStoredCurrencyData = async (kv: KVNamespace): Promise<CurrencyData> => {
  const data = await getStoredCurrencyData(kv, latestCurrencyDataKey);

  if (!data) {
    throw new Error('No stored currency data');
  }

  return data;
}
