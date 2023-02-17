import mappedCurrencies from "./currencies.json";

export type Currency = {
  country: string;
  name: string;
  symbol: string;
  code: number;
  units: number;
};

export const currencies: Currency[] = mappedCurrencies;

export const currencyCodes = currencies.map((currency) => currency.code);
