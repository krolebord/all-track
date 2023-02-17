import { z } from "zod";
import { currencyCodeSchema } from "../../validation/common";

export const newWalletSchema = z.object({
  name: z.string().min(1).max(32),
  description: z.string().min(1).max(512).optional(),
  balance: z.number().min(0),
  currency: currencyCodeSchema
});
