import { itemsQuery, statementsQuery, type Api } from "@/lib/api"
import type { QueryClient } from "@tanstack/react-query"

export const TAB = { statements: "statements", items: "items" } as const
export type Tab = (typeof TAB)[keyof typeof TAB]

export function parseTab(value?: string): Tab {
  return value === TAB.items ? TAB.items : TAB.statements
}

export const createTabPrefetch = (api: Api) => {
  return {
    [TAB.statements]: (qc: QueryClient) =>
      qc.prefetchQuery(statementsQuery(api)),
    [TAB.items]: (qc: QueryClient) => qc.prefetchQuery(itemsQuery(api)),
  } satisfies Record<Tab, (qc: QueryClient) => Promise<void>>
}
