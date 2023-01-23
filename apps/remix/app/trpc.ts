import type { AppRouter } from '@all-track/trpc';
import { transformer } from '@all-track/trpc/transformer';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
 
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: transformer,
  links: [
    httpBatchLink({
      url: 'http://api.mf/trpc',
      fetch: (...args) => api.fetch(...args),
    }),
  ],
});
