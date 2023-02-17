import type { AppRouter } from '@all-track/trpc';
import { transformer } from '@all-track/trpc/transformer';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import { lazy } from './utils/lazy';

export const userTrpc = (context: LoadContext, token?: string) => createTRPCProxyClient<AppRouter>({
  transformer: transformer,
  links: [
    loggerLink({
      enabled: (opts) => (context.env.ENV_MODE === 'development' && typeof window !== 'undefined')
        || (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: 'http://api.mf/trpc',
      fetch: (...args: [any, any]) => context.env.api.fetch(...args),
      headers: () => {
        if (!token) {
          return {};
        }
        
        return ({
          'Authorization': `Bearer ${token}`,
        });
      }
    }),
  ],
});

export const trpc = lazy((context: LoadContext) => userTrpc(context));
