import { z } from "zod";
import { zfd } from "zod-form-data";
import { currencyCodeSchema } from "./common";

export const newWalletSchema = z.object({
  name: z.string().min(3).max(32),
  description: z.string().min(3).max(512).optional(),
  balance: z.number().min(0, "Balance must be positive"),
  currencyCode: currencyCodeSchema
});

export const newWalletFormSchema = zfd.formData({
  name: zfd.text(newWalletSchema.shape.name),
  description: zfd.text(newWalletSchema.shape.description),
  balance: zfd.numeric(newWalletSchema.shape.balance),
  currencyCode: zfd.numeric(newWalletSchema.shape.currencyCode)
});
