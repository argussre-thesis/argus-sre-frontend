import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The backend allows 100 requests per 15 minutes per IP, so don't refetch fresh data.
      staleTime: 30_000,
      // A 4xx (including 429) won't change on retry; only retry network and server errors.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
        failureCount < 2,
    },
  },
})
