import { describe, vi, it, expect } from "vitest"
import { createApi } from "./endpoints"
import { stubFetch } from "@/test/utils"

describe("API endpoint helpers", () => {
  describe("createApi", () => {
    it("should merge defaultInit headers with per-call headers", async () => {
      stubFetch(Response.json({ id: "1" }))
      const api = createApi(() => "http://backend.test/api/v1", {
        cache: "no-store",
        headers: { authorization: "Bearer token" },
      })

      await api.createItem({ name: "Savings", type: "ASSET" })

      const [url, init] = vi.mocked(fetch).mock.calls[0]
      const headers = new Headers(init!.headers)

      expect(url).toBe("http://backend.test/api/v1/items")
      expect(headers.get("authorization")).toBe("Bearer token")
      expect(headers.get("content-type")).toBe("application/json")
      expect(init!.cache).toBe("no-store")
      expect(init!.method).toBe("POST")
    })

    it("should let per-call headers override defaults", async () => {
      stubFetch(Response.json({ id: "1" }))
      const api = createApi(() => "http://backend.test/api/v1", {
        headers: { "content-type": "application/xml" },
      })

      await api.createItem({ name: "Savings", type: "ASSET" })

      const headers = new Headers(vi.mocked(fetch).mock.calls[0][1]!.headers)
      expect(headers.get("content-type")).toBe("application/json")
    })
  })
})
