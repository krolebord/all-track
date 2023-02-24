import data from '@iso4217/json';
import fs from 'fs';
import { z } from 'zod';
import * as R from 'remeda';

const { json } = data;

const currencySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  code: z.number(),
  units: z.number(),
});

const mappedCurrencies = json.$data[0].$data
  .map((currencyRaw) => ({
    name: currencyRaw.$data[1]?.$data,
    symbol: currencyRaw.$data[2]?.$data,
    code: currencyRaw.$data[3]?.$data,
    units: currencyRaw.$data[4]?.$data,
  }))
  .filter((currency) => currencySchema.safeParse(currency).success)
  .filter((currency) => currency.code !== 0 && currency.units == 2);

const uniqueCurrencies = R.uniqBy(mappedCurrencies, (currency) => currency.code);

console.log('Writing mapped currencies info to currencies.json');
fs.writeFileSync('currencies.ts', `
export default ${JSON.stringify(uniqueCurrencies, null, 2)} as const;
`, 'utf8');
