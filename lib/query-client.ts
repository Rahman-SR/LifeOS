import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 15 * 60_000,
      retry: 2,
      staleTime: 2 * 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});
