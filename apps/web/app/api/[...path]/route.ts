import type { NextRequest } from "next/server"
import { backendOrigin } from "@/lib/api/server"
import { getApiToken } from "@/lib/auth/tokens"

async function bffProxy(
  request: NextRequest,
  ctx: RouteContext<"/api/[...path]">,
) {
  const { path } = await ctx.params
  const target = new URL(`${backendOrigin()}/api/${path.join("/")}`)
  target.search = request.nextUrl.search

  let token: string
  try {
    token = await getApiToken()
  } catch (error) {
    console.error(
      `[bffProxy] no access token for ${request.method} ${target.pathname}`,
      error,
    )
    return Response.json(
      {
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Your session has expired. Please sign in again.",
      },
      { status: 401, headers: { "content-type": "application/problem+json" } },
    )
  }
  const upstream = new Request(target, request)
  upstream.headers.set("Authorization", `Bearer ${token}`)

  try {
    return await fetch(upstream)
  } catch (error) {
    console.error(
      `[bffProxy] ${request.method} ${target.pathname} failed`,
      error,
    )
    return Response.json(
      {
        type: "about:blank",
        title: "Bad Gateway",
        status: 502,
        detail: "The backend service is unreachable",
      },
      {
        status: 502,
        headers: { "content-type": "application/problem+json" },
      },
    )
  }
}

export {
  bffProxy as GET,
  bffProxy as POST,
  bffProxy as PUT,
  bffProxy as DELETE,
  bffProxy as PATCH,
}
