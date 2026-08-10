"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CreateItemForm } from "./create-item-form"

export function CreateItemDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="self-start">
            <Plus />
            <span>Add item</span>
          </Button>
        }
      />
      <DialogContent className="top-1/4">
        <CreateItemForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
