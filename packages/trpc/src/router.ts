import { authRouter } from "./routers/auth.router";
import { helloRouter } from "./routers/hello.router";
import { t } from "./trpc";

export const appRouter = t.router({
  auth: authRouter,
  hello: helloRouter
});

export type AppRouter = typeof appRouter;
