import { newWalletSchema } from "@all-track/validation";
import { z } from "zod";
import { authorizedProcedure } from "../procedures";
import { t } from "../trpc";

export const walletsRouter = t.router({
  getWallets: authorizedProcedure
    .input(z.void())
    .query(async ({ ctx: { db, user } }) => {
      const wallets = await db.wallet.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          description: true,
          balance: true,
          currencyCode: true,
        }
      });

      return wallets;
    }
  ),
  createWallet: authorizedProcedure
    .input(newWalletSchema)
    .mutation(async ({ input, ctx: { db, user } }) => {
      const { id: walletId } = await db.wallet.create({
        data: {
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          balance: input.balance,
          currencyCode: input.currencyCode,
          userId: user.id
        },
        select: { id: true}
      });

      return { walletId };
    }
  )
});
