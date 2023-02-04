import { TRPCError } from "@trpc/server";
import { t } from "./trpc";

export const isAuthorized = t.middleware(({ next, ctx: { user } }) => {
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user }
  });
});

export const authorizedProcedure = t.procedure.use(isAuthorized);
