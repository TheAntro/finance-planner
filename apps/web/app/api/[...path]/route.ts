import type { NextRequest } from "next/server"
import { backendOrigin } from "@/lib/api/server"

async function bffProxy(
  request: NextRequest,
  ctx: RouteContext<"/api/[...path]">,
) {
  const { path } = await ctx.params
  const target = new URL(`${backendOrigin()}/api/${path.join("/")}`)
  target.search = request.nextUrl.search

  try {
    return await fetch(new Request(target, request))
  } catch (cause) {
    console.error(
      `[bffProxy] ${request.method} ${target.pathname} failed`,
      cause,
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
