import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export function LoadingCreateStatementForm({
  onCancel,
}: {
  onCancel: () => void
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing</EmptyTitle>
        <EmptyDescription>
          Please wait while we initialize a new statement
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  )
}
