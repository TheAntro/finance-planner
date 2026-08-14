"use client"

import { describeError, statementsQuery } from "@/lib/api"
import { browserApi } from "@/lib/api/browser"
import { formatIsoDate } from "@/lib/format"
import { formatCents } from "@/lib/money"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreateStatementDialog } from "./create-statement-dialog"

const COLUMNS = 4

export function StatementsDashboard() {
  const { data, isPending, error, refetch } = useQuery(
    statementsQuery(browserApi),
  )

  return (
    <div>
      <CreateStatementDialog />
      <Table>
        <TableCaption>A list of your networth statements</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Assets</TableHead>
            <TableHead>Liabilities</TableHead>
            <TableHead>Net Worth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell colSpan={COLUMNS} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          )}
          {error && !data && (
            <TableRow>
              <TableCell colSpan={COLUMNS}>
                <div className="flex items-center justify-center gap-1">
                  <span>{describeError(error)}</span>
                  <Button onClick={() => refetch()}>Retry</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={COLUMNS} className="text-center">
                No statements found
              </TableCell>
            </TableRow>
          )}
          {data?.map(
            ({
              id,
              statementDate,
              totalAssetsCents,
              totalLiabilitiesCents,
            }) => (
              <TableRow key={id}>
                <TableCell>{formatIsoDate(statementDate)}</TableCell>
                <TableCell className="tabular-nums">
                  {formatCents(totalAssetsCents)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCents(totalLiabilitiesCents)}
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatCents(totalAssetsCents - totalLiabilitiesCents)}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  )
}
