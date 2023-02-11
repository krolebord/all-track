import { appRouter, createApiContext } from '@all-track/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

type Env = {
  JWT_SECRET: string,
  DATABASE_PROXY_URL: string
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: () => createApiContext({
        jwt: {
          secret: env.JWT_SECRET
        },
        request,
        db: {
          url: env.DATABASE_PROXY_URL
        }
      }),
    });
  },
};
