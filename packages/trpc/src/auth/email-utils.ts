import { UserEmailProvider } from "@all-track/db";
import { z } from "zod";

type UserEmailResult = 
  | { status: 'invalid-token' }
  | { status: 'invalid-token-data' }
  | { status: 'email-not-verified' }
  | { status: 'ok', email: string };

const githubEmailsSchema = z.array(z.object({
  email: z.string().email(),
  primary: z.boolean(),
  verified: z.boolean()
}));

const fetchGithubUserEmail = async (token: string): Promise<UserEmailResult> => {
  const response = await fetch('https://api.github.com/user/emails', {
    headers: {
      Accept: "application/json",
      'User-Agent': 'request',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { status: 'invalid-token' };
  }

  const data = await response.json();

  const emailsParseResult = githubEmailsSchema.safeParse(data);

  if (!emailsParseResult.success) {
    return { status: 'invalid-token-data' };
  }

  const email = emailsParseResult.data
    .find(email => email.verified && email.primary)?.email;

  if (!email) {
    return { status: 'email-not-verified' };
  }

  return { status: 'ok', email };
}

const googleUserSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  'email_verified': z.boolean(),
});

const fetchGoogleUserEmail = async (token: string): Promise<UserEmailResult> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { status: 'invalid-token' };
  }

  const data = await response.json();

  const parseResult = googleUserSchema.safeParse(data);

  if (!parseResult.success) {
    return { status: 'invalid-token-data' };
  }

  if (!parseResult.data.email_verified) {
    return { status: 'email-not-verified' };
  }

  return { status: 'ok', email: parseResult.data.email };
}

export const fetchVerifiedUserEmail = (provider: UserEmailProvider, token: string): Promise<UserEmailResult> => {
  switch (provider) {
    case 'GitHub':
      return fetchGithubUserEmail(token);
    case 'Google':
      return fetchGoogleUserEmail(token);
    default:
      throw new Error('Invalid provider');
  }
}
