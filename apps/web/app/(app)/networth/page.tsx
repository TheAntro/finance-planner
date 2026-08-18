import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client/get-query-client"
import { NetworthTabs } from "./_components/networth-tabs"
import { createTabPrefetch, parseTab } from "./_lib/tabs"
import { serverApi } from "@/lib/api/server"
import { getLogtoContext } from "@logto/next/server-actions"
import { logtoConfig } from "@/lib/auth/logto-config"
import { SignInPrompt } from "@/components/sign-in-prompt"

export const metadata: Metadata = {
  title: "Networth",
}

export default async function NetworthPage(props: PageProps<"/networth">) {
  const { isAuthenticated } = await getLogtoContext(logtoConfig())
  if (!isAuthenticated) return <SignInPrompt />

  const api = await serverApi()
  const prefetch = createTabPrefetch(api)
  const { tab } = await props.searchParams
  const active = parseTab(typeof tab === "string" ? tab : undefined)

  const qc = getQueryClient()
  await prefetch[active](qc)

  return (
    <div className="py-4">
      <h1 className="mb-4 text-2xl font-bold">Networth</h1>
      <HydrationBoundary state={dehydrate(qc)}>
        <NetworthTabs />
      </HydrationBoundary>
    </div>
  )
}
