import { z } from "zod";
import { currencyDataKey, getStoredCurrencyData, latestCurrencyDataKey, storeCurrencyData } from "@all-track/currencies-store/server";
import { fetchCurrencies } from "~/fetch";

export type Env = {
  CURRENCIES_KV: KVNamespace;
  CURRENCIES_API_KEY: string;
  CURRENCIES_API_URL: string;
};

const validateEnvKey = (key: string) => {
  const apiKeySchema = z.string().min(1);
  const result = apiKeySchema.safeParse(key);

  if (!result.success) {
    throw new Error(`Invalid env key: ${result.error.message}`);
  }
  
  return result.data;
}

const parseCurrenciesRequest = (request: Request) => {
  const url = new URL(request.url);
  const rawDate = url.searchParams.get('date');

  if (!rawDate) {
    return { status: 'no-date' } as const;
  }

  const parsedDate = Date.parse(rawDate);

  if (isNaN(parsedDate)) {
    return { status: 'invalid-date' } as const;
  }

  return { status: 'date', date: new Date(parsedDate) };
}

const json = (value: unknown, status?: number) => new Response(JSON.stringify(value), {
  status: status ?? 200,
  headers: {
    'content-type': 'application/json'
  }
});

const hideErrors = <T extends (...args: any[]) => any>(fn: T) => {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (e) {
      return new Response(null, { status: 500 });
    }
  }
}

export default {
  fetch: hideErrors(async (request: Request, env: Env): Promise<Response> => {
    const { CURRENCIES_KV, CURRENCIES_API_KEY, CURRENCIES_API_URL } = env;

    const { status, date } = parseCurrenciesRequest(request);

    if (status === 'invalid-date') {
      return new Response('Invalid date', { status: 400 });
    }
    else if (status === 'date') {
      const data = await getStoredCurrencyData(CURRENCIES_KV, currencyDataKey(date));

      if (!data) {
        return new Response('No stored currency data found for this date', { status: 404 });
      }

      return json(data);
    }

    let latestData = await getStoredCurrencyData(CURRENCIES_KV, latestCurrencyDataKey);

    if (!latestData) {
      const apiUrl = validateEnvKey(CURRENCIES_API_URL);
      const apiKey = validateEnvKey(CURRENCIES_API_KEY);

      latestData = await fetchCurrencies(apiUrl, apiKey);
      
      await storeCurrencyData({
        kv: CURRENCIES_KV,
        overrideLatest: true,
        date: date ?? new Date(),
        data: latestData
      });
    }

    return json(latestData);
  }),
  scheduled: async (event: ScheduledEvent, env: Env) => {
    const { CURRENCIES_KV, CURRENCIES_API_KEY, CURRENCIES_API_URL } = env;

    const apiUrl = validateEnvKey(CURRENCIES_API_URL);
    const apiKey = validateEnvKey(CURRENCIES_API_KEY);

    const data = await fetchCurrencies(apiUrl, apiKey);

    await storeCurrencyData({
      kv: CURRENCIES_KV,
      overrideLatest: true,
      date: new Date(event.scheduledTime),
      data
    });

    console.log('Currencies updated');
  }
};
