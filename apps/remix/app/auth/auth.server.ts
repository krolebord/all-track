import { Authenticator } from "remix-auth";
import { GoogleStrategy } from 'remix-auth-google';
import { GitHubStrategy } from "remix-auth-github";
import { sessionStorage } from "./session-storage.server";
import { z } from "zod";
import { config } from "~/env.server";
import { trpc } from "~/trpc.server";
import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "@all-track/trpc";

export const userSchema = z.object({
  email: z.string().email(),
  provider: z.string(),
  apiToken: z.string(),
});

export type User = z.infer<typeof userSchema>;

type AuthCallbackOptions = inferRouterInputs<AppRouter>['auth']['loginWithExternalProvider'];

const externalAuthCallback = async (opts: AuthCallbackOptions): Promise<User> => {
  const apiCredentials = await trpc().auth.loginWithExternalProvider.mutate(opts);

  if (apiCredentials.status !== 'ok') {
    throw new Error('Could not login with external provider');
  }

  return {
    provider: apiCredentials.user.emailProvider,
    email: apiCredentials.user.email,
    apiToken: apiCredentials.apiToken,
  };
}

export const authenticator = new Authenticator<User>(sessionStorage);

const gitHubStrategy = new GitHubStrategy<User>(
  {
    clientID: config.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: config.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: config.GITHUB_OAUTH_CALLBACK_URL,
  },
  async ({ accessToken, profile }) => externalAuthCallback({
    email: profile.emails[0].value,
    token: {
      provider: 'GitHub',
      token: accessToken,
    }
  })
);

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID: config.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: config.GOOGLE_OAUTH_CALLBACK_URL,
  },
  async ({ accessToken, profile }) => externalAuthCallback({
    email: profile.emails[0].value,
    token: {
      provider: 'Google',
      token: accessToken,
    }
  })
);

authenticator.use(gitHubStrategy, 'github');
authenticator.use(googleStrategy, 'google');
