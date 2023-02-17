import { authRouter } from "./routers/auth.router";
import { t } from "./trpc";

export const appRouter = t.router({
  auth: authRouter
});

export type AppRouter = typeof appRouter;
