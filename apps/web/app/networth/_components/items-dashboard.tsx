"use client"

import { useQuery } from "@tanstack/react-query"
import { browserApi } from "@/lib/api/browser"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatItemType } from "@/lib/format"
import { CreateItemDialog } from "./create-item-dialog"
import { describeError, itemsQuery } from "@/lib/api"
import { Button } from "@/components/ui/button"

const COLUMNS = 2

export function ItemsDashboard() {
  const { data, isPending, error, refetch } = useQuery(itemsQuery(browserApi))

  return (
    <div className="flex flex-col gap-3">
      <CreateItemDialog />
      <Table>
        <TableCaption>List of your current items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
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
                No items found
              </TableCell>
            </TableRow>
          )}
          {data?.map(({ id, name, type }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{formatItemType(type)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
