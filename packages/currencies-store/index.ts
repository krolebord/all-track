import { Currency } from "@all-track/currencies";
import { z } from "zod";
import { createKvJsonStore } from "./kv-store";

export type CurrencyWithRate = Currency & {
  rate: number;
};

export type CurrencyData = {
  lastUpdated: Date;
  currencies: Record<string, CurrencyWithRate>;
};

const currencyDataSchema = z.object({
  lastUpdated: z.preprocess(
    (x) => (typeof x === "string" ? new Date(x) : x),
    z.date()
  ),
  currencies: z.record(z.string(), z.object({
    symbol: z.string(),
    code: z.number(),
    sign: z.string(),
    name: z.string(),
    displayName: z.string(),
    units: z.literal(2),
    rate: z.number().gt(0),
  })),
});

export const fetchCurrenciesData = async (fetcher: Fetcher, date?: Date): Promise<CurrencyData> => {
  const url = new URL('/', 'https://no.op');
  if (date) {
    url.searchParams.set('date', date.toISOString());
  }

  const data = fetcher.fetch(new Request(url));
  const currencyData = currencyDataSchema.parse(data);

  return currencyData;
};
