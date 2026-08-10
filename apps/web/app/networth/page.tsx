import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client/get-query-client"
import { NetworthTabs } from "./_components/networth-tabs"
import { createTabPrefetch, parseTab } from "./_lib/tabs"
import { serverApi } from "@/lib/api/server"

export const metadata: Metadata = {
  title: "Networth",
}

const prefetch = createTabPrefetch(serverApi)

export default async function NetworthPage(props: PageProps<"/networth">) {
  const { tab } = await props.searchParams
  const active = parseTab(typeof tab === "string" ? tab : undefined)

  const qc = getQueryClient()
  await prefetch[active](qc)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Networth</h1>
      <HydrationBoundary state={dehydrate(qc)}>
        <NetworthTabs />
      </HydrationBoundary>
    </div>
  )
}
