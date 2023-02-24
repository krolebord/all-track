import { z } from "zod";
import { zfd } from "zod-form-data";

export const newTransactionSchema = z.object({
  walletId: z.string(),
  amount: z.number().min(0, "Amount must be positive"),
  description: z.string().min(3).max(512)
})

export const newTransactionFormSchema = zfd.formData({
  walletId: zfd.text(newTransactionSchema.shape.walletId),
  amount: zfd.text(newTransactionSchema.shape.amount),
  description: zfd.text(newTransactionSchema.shape.description)
});
