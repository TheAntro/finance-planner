import { fetchJson } from "./fetch"
import type {
  CreateItemRequest,
  ItemResponse,
  StatementResponse,
} from "./types"

function mergeInit(
  base: RequestInit | undefined,
  override: RequestInit,
): RequestInit {
  const headers = new Headers(base?.headers)
  new Headers(override.headers).forEach((value, key) => headers.set(key, value))
  return { ...base, ...override, headers }
}

export function createApi(baseUrl: () => string, defaultInit?: RequestInit) {
  const jsonInit = (method: string, body: unknown): RequestInit =>
    mergeInit(defaultInit, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })

  return {
    listStatements: () =>
      fetchJson<StatementResponse[]>(`${baseUrl()}/statements`, defaultInit),
    listItems: () =>
      fetchJson<ItemResponse[]>(`${baseUrl()}/items`, defaultInit),
    createItem: (body: CreateItemRequest) =>
      fetchJson<ItemResponse>(`${baseUrl()}/items`, jsonInit("POST", body)),
  }
}
