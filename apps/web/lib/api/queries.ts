import { queryOptions } from "@tanstack/react-query"
import { itemKeys, statementKeys } from "./keys"
import type { createApi } from "./endpoints"

export type Api = ReturnType<typeof createApi>

export const statementsQuery = (api: Api) =>
  queryOptions({
    queryKey: statementKeys.all,
    queryFn: () => api.listStatements(),
  })

export const itemsQuery = (api: Api) =>
  queryOptions({
    queryKey: itemKeys.all,
    queryFn: () => api.listItems(),
  })
