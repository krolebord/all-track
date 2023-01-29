import { appRouter, createApiContext } from '@all-track/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

type Env = {
  DATABASE_HOST: string,
  DATABASE_USERNAME: string,
  DATABASE_PASSWORD: string
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: () => createApiContext({
        db: {
          host: env.DATABASE_HOST,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
        }
      }),
    });
  },
};
