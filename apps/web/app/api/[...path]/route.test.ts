import { NextRequest } from "next/server"
import { describe, it, vi, expect } from "vitest"
import { GET, POST } from "./route"
import { stubFetch } from "@/test/utils"

const context = (...path: string[]) => ({ params: Promise.resolve({ path }) })
const upstreamRequest = () => vi.mocked(fetch).mock.calls[0][0] as Request
vi.mock("@/lib/auth/tokens", () => ({
  getApiToken: () => Promise.resolve("test-token"),
}))

describe("backend-for-frontend proxy", () => {
  it("should forward method, path and query string to the backend", async () => {
    stubFetch(Response.json([]))

    await GET(
      new NextRequest("http://locahost:3000/api/v1/statements?limit=5"),
      context("v1", "statements"),
    )

    const upstream = upstreamRequest()
    expect(upstream.url).toBe("http://backend.test/api/v1/statements?limit=5")
    expect(upstream.method).toBe("GET")
  })

  it("should forward request body on POST", async () => {
    stubFetch(Response.json({ id: "1" }, { status: 201 }))
    const body = { name: "Savings", type: "ASSET" }

    await POST(
      new NextRequest("http://localhost:3000/api/v1/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      context("v1", "items"),
    )

    const upstream = upstreamRequest()
    expect(upstream.method).toBe("POST")
    await expect(upstream.json()).resolves.toEqual(body)
  })

  it("should relay backend error responses", async () => {
    const problem = {
      type: "about:blank",
      title: "Not Found",
      status: 404,
      detail: "Statement not found with id: 123",
    }
    stubFetch(
      new Response(JSON.stringify(problem), {
        status: 404,
        headers: { "content-type": "application/problem+json" },
      }),
    )

    const response = await GET(
      new NextRequest("http://localhost:3000/api/v1/statements/123"),
      context("v1", "statements", "123"),
    )

    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toBe(
      "application/problem+json",
    )
    await expect(response.json()).resolves.toEqual(problem)
  })

  it("should return 502 problem+json when the backend is unreachable", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    stubFetch(new TypeError("fetch failed"))

    const response = await GET(
      new NextRequest("http://localhost:3000/api/v1/statements"),
      context("v1", "statements"),
    )

    expect(response.status).toBe(502)
    expect(response.headers.get("content-type")).toBe(
      "application/problem+json",
    )
    await expect(response.json()).resolves.toMatchObject({ status: 502 })
    expect(consoleError).toHaveBeenCalled()
  })
})
