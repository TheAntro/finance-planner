import { describe, expect, it } from "vitest"
import { fetchJson, fetchNoContent } from "./fetch"
import { ApiError, NetworkError } from "./errors"
import { rejection, stubFetch } from "@/test/utils"

describe("fetch helpers", () => {
  describe("fetchJson", () => {
    it("should return the parsed response", async () => {
      stubFetch(Response.json([{ id: "1" }]))
      const result = await fetchJson<{ id: string }[]>("/api/items")
      expect(result).toEqual([{ id: "1" }])
    })

    it("should throw ApiError carrying the problem detail", async () => {
      const problem = {
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "Item not found with id: 123",
      }
      const url = "/api/items/123"
      stubFetch(
        new Response(JSON.stringify(problem), {
          status: 404,
          headers: { "content-type": "application/problem+json" },
        }),
      )

      const error = await rejection(fetchJson(url))

      expect(error).toBeInstanceOf(ApiError)
      expect((error as ApiError).problem).toEqual(problem)
      expect((error as ApiError).url).toBe(url)
      expect((error as ApiError).message).toBe(problem.detail)
    })

    it("should throw ApiError, not SyntaxError, when the error body is not JSON", async () => {
      stubFetch(
        new Response("<html>Server Error</html>", {
          status: 500,
          statusText: "Internal Server Error",
          headers: { "content-type": "text/html" },
        }),
      )

      const error = await rejection(fetchJson("/api/items"))

      expect(error).toBeInstanceOf(ApiError)
      expect((error as ApiError).problem.status).toBe(500)
      expect((error as ApiError).problem.title).toBe("Internal Server Error")
    })

    it("should throw NetworkError preserving the cause when fetch rejects", async () => {
      const cause = new TypeError("fetch failed")
      stubFetch(cause)

      const error = await rejection(fetchJson("/api/items"))

      expect(error).toBeInstanceOf(NetworkError)
      expect((error as NetworkError).cause).toBe(cause)
    })

    it("should pass init through to fetch", async () => {
      stubFetch(Response.json({}))
      await fetchJson("/api/items", { method: "POST" })
      expect(fetch).toHaveBeenCalledWith("/api/items", { method: "POST" })
    })
  })

  describe("fetchNoContent", () => {
    it("should resolve for a 204 response", async () => {
      stubFetch(new Response(null, { status: 204 }))
      await expect(fetchNoContent("/api/items")).resolves.toBeUndefined()
    })

    it("should throw ApiError for a failed request", async () => {
      stubFetch(new Response(null, { status: 403, statusText: "Forbidden" }))
      const error = await rejection(fetchNoContent("/api/items/1"))
      expect(error).toBeInstanceOf(ApiError)
    })
  })
})
