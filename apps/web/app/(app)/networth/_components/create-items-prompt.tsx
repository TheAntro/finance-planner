import { PlusIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"

export function CreateItemsPrompt({ onClose }: { onClose: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia></EmptyMedia>
        <EmptyTitle>No Networth Items</EmptyTitle>
        <EmptyDescription>
          First add items to include in your networth statements.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Invite Members
        </Button>
        <Link
          href="?items"
          onClick={onClose}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Go to Items
        </Link>
      </EmptyContent>
    </Empty>
  )
}
