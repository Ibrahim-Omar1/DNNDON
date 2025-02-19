"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

/**
 * Providers component that wraps the app with necessary context providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 