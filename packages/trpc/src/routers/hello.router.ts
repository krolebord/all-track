import { t } from "../trpc";
import { z } from "zod";

export const helloRouter = t.router({
  world: t.procedure
    .input(z.string())
    .query(({ input }) => {
      return { 
        message:`Hello ${input}!!`,
        date: new Date(),
      }
    }),
  entries: t.procedure
    .input(z.void())
    .query(async ({ ctx }) => {
      const entries = await ctx.db
        .selectFrom('Entry')
        .selectAll()
        .execute();

      return entries;
    }),
});
