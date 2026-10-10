"use client"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { makeQueryClient } from "@/lib/query-client/make-query-client"
import { ApiError } from "@/lib/api"

const SESSION_EXPIRED_CODE = "session_expired"
let isReauthenticationStarted = false

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() =>
    makeQueryClient({
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.problem.status === 401 &&
          error.problem.code === SESSION_EXPIRED_CODE &&
          !isReauthenticationStarted
        ) {
          isReauthenticationStarted = true
          // This must be a document navigation so the Route Handler can redirect to Logto.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/api/auth/relogin"
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
