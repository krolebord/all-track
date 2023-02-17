import data from '@iso4217/json';
import fs from 'fs';
import { z } from 'zod';

const { json } = data;

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort((a, b) => a - b);
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}

const currencySchema = z.object({
  country: z.string(),
  name: z.string(),
  symbol: z.string(),
  code: z.number(),
  units: z.number(),
});

const mappedCurrencies = json.$data[0].$data
  .map((currencyRaw) => ({
    country: currencyRaw.$data[0]?.$data,
    name: currencyRaw.$data[1]?.$data,
    symbol: currencyRaw.$data[2]?.$data,
    code: currencyRaw.$data[3]?.$data,
    units: currencyRaw.$data[4]?.$data,
  }))
  .filter((currency) => currencySchema.safeParse(currency).success);

const distinctCurrencies = mappedCurrencies.filter((currency, index, self) =>
  index === self.findIndex((t) => (
    t.code === currency.code
  ))
);

console.log('Writing mapped currencies info to currencies.json');
fs.writeFileSync('currencies.json', JSON.stringify(distinctCurrencies), 'utf8');
