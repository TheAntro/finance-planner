"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateStatementForm } from "./create-statement-form"
import { useQuery } from "@tanstack/react-query"
import { describeError, itemsQuery, statementsQuery } from "@/lib/api"
import { browserApi } from "@/lib/api/browser"
import { LoadingCreateStatementForm } from "./loading-create-statement-form"
import { CreateItemsPrompt } from "./create-items-prompt"

export function CreateStatementDialog() {
  const [open, setOpen] = useState(false)
  const {
    isPending: itemsPending,
    data: items,
    error: itemsError,
  } = useQuery(itemsQuery(browserApi))
  const {
    isPending: statementsPending,
    data: statements,
    error: statementsError,
  } = useQuery(statementsQuery(browserApi))

  const pending = itemsPending || statementsPending
  const error = itemsError || statementsError
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="self-start">
            <Plus />
            <span>Add statement</span>
          </Button>
        }
      />
      <DialogContent className="grid-rows-[auto_1fr]">
        <DialogHeader>
          <DialogTitle>Add statement</DialogTitle>
        </DialogHeader>
        {pending && (
          <LoadingCreateStatementForm onCancel={() => setOpen(false)} />
        )}
        {error && (
          <span>
            {[itemsError, statementsError]
              .filter(Boolean)
              .map((err) => describeError(err))
              .join(", ")}
          </span>
        )}
        {!error && items?.length === 0 && (
          <CreateItemsPrompt onClose={() => setOpen(false)} />
        )}
        {!error && items && items.length > 0 && (
          <CreateStatementForm
            items={items}
            takenDates={
              new Set(statements?.map(({ statementDate }) => statementDate))
            }
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
