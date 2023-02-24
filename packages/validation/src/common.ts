import { currencyCodes } from "@all-track/currencies";
import { z } from "zod";

export const currencyCodeSchema = z
  .number()
  .refine((code) => (currencyCodes as number[]).includes(code), { message: "Invalid currency code" });
