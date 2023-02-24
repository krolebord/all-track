import type validCurrencies from "./currencies";

export type Currency = {
  symbol: string;
  code: number;
  sign: string;

  name: string;
  displayName: string;
  
  units: 2;
};

type ValidCurrency = typeof validCurrencies[number];

export const currencies = [
  {
    name: 'US Dollar',
    displayName: 'US Dollar',
    symbol: 'USD',
    sign: '$',
    code: 840,
    units: 2,
  },
  {
    name: 'Euro',
    displayName: 'Euro',
    symbol: 'EUR',
    sign: '€',
    code: 978,
    units: 2,
  },
  {
    name: 'Hryvnia',
    displayName: 'Hryvnia',
    symbol: 'UAH',
    sign: '₴',
    code: 980,
    units: 2,
  },
  {
    name: 'Zloty',
    displayName: 'Zloty',
    symbol: 'PLN',
    sign: 'zł',
    code: 985,
    units: 2,
  },
  {
    name: 'Pound Sterling',
    displayName: 'Pound Sterling',
    symbol: 'GBP',
    sign: '£',
    code: 826,
    units: 2,
  }
] as const satisfies readonly (ValidCurrency & Omit<Currency, keyof ValidCurrency>)[];

export const currencyCodes = currencies.map((currency) => currency.code);
