"use client"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { makeQueryClient } from "@/lib/query-client/make-query-client"
import { ApiError } from "@/lib/api"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() =>
    makeQueryClient({
      onError: (error) => {
        if (error instanceof ApiError && error.problem.status === 401) {
          window.location.reload()
        }
      },
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
