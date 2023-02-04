import type { AppRouter } from '@all-track/trpc';
import { transformer } from '@all-track/trpc/transformer';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';

export const trpc = (token?: string) => createTRPCProxyClient<AppRouter>({
  transformer: transformer,
  links: [
    loggerLink({
      enabled: (opts) => (ENV_MODE === 'development' && typeof window !== 'undefined')
        || (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: 'http://api.mf/trpc',
      fetch: (...args) => api.fetch(...args),
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
