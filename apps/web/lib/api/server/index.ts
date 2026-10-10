import "server-only"
import { backendOrigin } from "./origin"
import { createApi } from "../endpoints"
import { requireApiToken } from "@/lib/auth/require-session"
export * from "./origin"

export async function serverApi() {
  return createApi(() => `${backendOrigin}/api/v1`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${await requireApiToken()}` },
  })
}

// export const serverApi = createApi(() => `${backendOrigin()}/api/v1`, {
//   cache: "no-store",
// })
