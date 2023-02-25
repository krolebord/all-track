import { currencies } from "@all-track/currencies";
import { z } from "zod";

export const fetchCurrencies = async (apiUrl: string, apiKey: string) => {
  const currencySchema = z.object({
    code: z.string(),
    value: z.number().gt(0),
  });
  
  const currenciesResponseSchema = z.object({
    meta: z.object({
      last_updated_at: z.preprocess(x => typeof x === 'string' && new Date(x), z.date()),
    }),
    data: z.record(z.string(), currencySchema)
  });

  const url = new URL(apiUrl);
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url, {
    headers: { 'apiKey': apiKey }
  });

  if (response.status !== 200) {
    throw new Error(`Invalid response status: ${response.status}`);
  }

  const rawData = await response.json();
  const dataResult = currenciesResponseSchema.safeParse(rawData);

  if (!dataResult.success) {
    throw new Error(`Invalid response: ${dataResult.error.message}`);
  }

  const { meta, data: currencyRates } = dataResult.data;

  const currenciesWithRate = Object.fromEntries(currencies.map(currency => {
    if (!(currency.symbol in currencyRates)) {
      throw new Error(`Currency ${currency.symbol} not found in response`);
    }

    const { value: rate } = currencyRates[currency.symbol];

    const currencyWithRate = {
      ...currency,
      rate,
    };

    return [currency.symbol, currencyWithRate];
  }));

  return {
    lastUpdated: meta.last_updated_at,
    currencies: currenciesWithRate
  }
};
