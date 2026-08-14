import z from "zod"
import { amountToCents } from "@/lib/money"
import { ApiError, describeError } from "@/lib/api"
import { toIsoDate } from "@/lib/format"

export const statementSchema = z.object({
  statementDate: z.date({ message: "Pick a date" }).transform(toIsoDate),
  statementItems: z
    .array(
      z.object({
        itemId: z.uuid("Select an item"),
        amountCents: amountToCents,
      }),
    )
    .min(1, "Add at least one item")
    .refine((rows) => new Set(rows.map((r) => r.itemId)).size === rows.length, {
      message: "Each item can only appear once",
    }),
})

export function toStatementErrors(
  error: unknown,
  rows: { itemId: string }[],
): { fields: Record<string, string[]>; form?: string } {
  if (error instanceof ApiError) {
    const { problem } = error
    if (problem.errors) return { fields: problem.errors }
    if (problem.itemIds?.length) {
      const missing = new Set(problem.itemIds)
      const fields: Record<string, string[]> = {}
      rows.forEach((row, i) => {
        if (missing.has(row.itemId)) {
          fields[`statementItems[${i}].itemId`] = ["This item has been removed"]
        }
      })
      return { fields, form: problem.detail }
    }

    if (problem.status === 409) {
      return {
        fields: {
          statementDate: [
            problem.detail ?? "A statement already exists for this date",
          ],
        },
      }
    }
  }
  return { fields: {}, form: describeError(error) }
}
