import "server-only"
import { backendOrigin } from "./origin"
import { createApi } from "../endpoints"
export * from "./origin"

export const serverApi = createApi(() => `${backendOrigin()}/api/v1`, {
  cache: "no-store",
})
