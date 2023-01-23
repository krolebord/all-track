import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { transformer } from "../transformer";

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});
