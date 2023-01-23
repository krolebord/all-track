import { helloRouter } from "./routers/hello.router";
import { t } from "./trpc";

export const appRouter = t.router({
  hello: helloRouter
});

export type AppRouter = typeof appRouter;
