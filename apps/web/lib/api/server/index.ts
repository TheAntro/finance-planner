import "server-only"
import { backendOrigin } from "./origin"
import { createApi } from "../endpoints"
import { getApiTokenRSC } from "@/lib/auth/tokens"
export * from "./origin"

export async function serverApi() {
  return createApi(() => `${backendOrigin}/api/v1`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${await getApiTokenRSC()}` },
  })
}

// export const serverApi = createApi(() => `${backendOrigin()}/api/v1`, {
//   cache: "no-store",
// })
