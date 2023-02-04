declare global {
  // eslint-disable-next-line no-var
  var api: { fetch: typeof fetch };
  var ENV_MODE: 'development' | 'production';

  var COOKIE_SECRET: string;

  var GITHUB_OAUTH_CLIENT_ID: string;
  var GITHUB_OAUTH_CLIENT_SECRET: string;
  var GITHUB_OAUTH_CALLBACK_URL: string;

  var GOOGLE_OAUTH_CLIENT_ID: string;
  var GOOGLE_OAUTH_CLIENT_SECRET: string;
  var GOOGLE_OAUTH_CALLBACK_URL: string;
}

export {};
