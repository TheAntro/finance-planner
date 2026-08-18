"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseTab, TAB, createTabPrefetch, type Tab } from "../_lib/tabs"
import { ItemsDashboard } from "./items-dashboard"
import { StatementsDashboard } from "./statements-dashboard"
import { useQueryClient } from "@tanstack/react-query"
import { browserApi } from "@/lib/api/browser"

const prefetch = createTabPrefetch(browserApi)

export function NetworthTabs() {
  const searchParams = useSearchParams()
  const active = parseTab(searchParams.get("tab") ?? undefined)
  const qc = useQueryClient()

  function selectTab(value: Tab) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <Tabs value={active} onValueChange={selectTab}>
      <TabsList>
        <TabsTrigger
          value={TAB.statements}
          onMouseEnter={() => prefetch[TAB.statements](qc)}
        >
          Statements
        </TabsTrigger>
        <TabsTrigger
          value={TAB.items}
          onMouseEnter={() => prefetch[TAB.items](qc)}
        >
          Items
        </TabsTrigger>
      </TabsList>
      <TabsContent value={TAB.statements}>
        <StatementsDashboard />
      </TabsContent>
      <TabsContent value={TAB.items}>
        <ItemsDashboard />
      </TabsContent>
    </Tabs>
  )
}
