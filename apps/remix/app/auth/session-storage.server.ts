import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth-session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [COOKIE_SECRET],
    secure: ENV_MODE === "production",
  },
});
