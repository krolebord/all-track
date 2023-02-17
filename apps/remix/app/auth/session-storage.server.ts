import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { lazy } from "~/utils/lazy";

export const sessionStorage = lazy((context: LoadContext) => createCookieSessionStorage({
  cookie: {
    name: "_auth-session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [context.env.COOKIE_SECRET],
    secure: context.env.ENV_MODE === "production",
  },
}));
