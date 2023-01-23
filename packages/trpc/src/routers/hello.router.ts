import { t } from "../trpc";
import { z } from "zod";

export const helloRouter = t.router({
  world: t.procedure
    .input(z.void())
    .query(({ input }) => {
      return { 
        message:`Hello ${input}!!`,
        date: new Date(),
      }
    }),
});
