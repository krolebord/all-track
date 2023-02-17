declare module "__STATIC_CONTENT_MANIFEST" {
  const value: string;
  export default value;
}

interface Env {
  __STATIC_CONTENT: KVNamespace<string>;

  api: Fetcher;
  ENV_MODE: 'development' | 'production';

  COOKIE_SECRET: string;

  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GITHUB_OAUTH_CALLBACK_URL: string;

  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_CALLBACK_URL: string;
}

type LoadContext = {
  env: Env;
};

interface DataFunctionArgs {
  request: Request;
  context: LoadContext;
  params: Params;
};

type LoaderArgs = DataFunctionArgs;

type ActionArgs = DataFunctionArgs;
