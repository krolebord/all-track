import { z } from "zod";
import { clientConfig } from "./env";

const serverEnvScheme = z.object({
  COOKIE_SECRET: z.string(),

  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_CALLBACK_URL: z.string(),

  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_CALLBACK_URL: z.string(),
});

const parsedEnv = serverEnvScheme.parse({
  COOKIE_SECRET,
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GITHUB_OAUTH_CALLBACK_URL,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_CALLBACK_URL,
});

export const config = {
  ...clientConfig,
  ...parsedEnv,
};
