'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { ApiError, NETWORK_ERROR_STATUS } from '@/lib/api/client'

const MAX_RETRIES = 2

/** Retry what might succeed next time (5xx, network); a 400 or 404 won't change. */
function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= MAX_RETRIES) return false
  return error instanceof ApiError && (error.status >= 500 || error.status === NETWORK_ERROR_STATUS)
}

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session, created lazily so it is never shared between server requests.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: shouldRetry,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
