import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query"

export function makeQueryClient({
  onError,
}: {
  onError?: (error: unknown) => void
} = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000 },
    },
    mutationCache: onError ? new MutationCache({ onError }) : undefined,
    queryCache: onError ? new QueryCache({ onError }) : undefined,
  })
}
