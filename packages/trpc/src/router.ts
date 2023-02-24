import { authRouter } from "./routers/auth.router";
import { walletsRouter } from "./routers/wallets.router";
import { t } from "./trpc";

export const appRouter = t.router({
  auth: authRouter,
  wallets: walletsRouter
});

export type AppRouter = typeof appRouter;
