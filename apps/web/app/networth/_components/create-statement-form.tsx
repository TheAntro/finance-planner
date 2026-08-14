import { useForm } from "@tanstack/react-form"
import { statementSchema, toStatementErrors } from "../_lib/statement-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field"
import type { Item } from "@/lib/api/types"
import { useId, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Trash2 } from "lucide-react"
import { formatIsoDate, toIsoDate } from "@/lib/format"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { browserApi } from "@/lib/api/browser"
import { statementKeys } from "@/lib/api"

export function CreateStatementForm({
  items,
  takenDates,
  onSuccess,
}: {
  items: Item[]
  takenDates: Set<string>
  onSuccess: () => void
}) {
  const [dateOpen, setDateOpen] = useState(false)
  const baseId = useId()
  const dateId = `${baseId}-date`

  const itemsById = new Map(items.map((i) => [i.id, i]))
  const [pendingItemId, setPendingItemId] = useState("")
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  const qc = useQueryClient()
  const { mutateAsync: createStatement } = useMutation({
    mutationFn: browserApi.createStatement,
    onSuccess: () => qc.invalidateQueries({ queryKey: statementKeys.all }),
  })

  const form = useForm({
    defaultValues: {
      statementDate: new Date(),
      statementItems: items.map((i) => ({ itemId: i.id, amountCents: "" })),
    },
    validators: {
      onSubmit: statementSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const payload = statementSchema.parse(value)
      try {
        await createStatement(payload)
        onSuccess()
      } catch (error) {
        const { fields, form: formError } = toStatementErrors(
          error,
          value.statementItems,
        )
        formApi.setErrorMap({
          onSubmit: {
            form: formError,
            fields: Object.fromEntries(
              Object.entries(fields).map(([path, messages]) => [
                path,
                messages.join(", "),
              ]),
            ),
          },
        })
      }
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex min-h-0 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 pr-1">
        <FieldGroup>
          <form.Field name="statementDate">
            {(field) => {
              const invalid = !field.state.meta.isValid
              const errorId = `${dateId}-error`

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={dateId}>Date</FieldLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          id={dateId}
                          variant="outline"
                          className="max-w-max justify-start"
                          aria-invalid={invalid}
                          aria-describedby={errorId}
                        >
                          <CalendarIcon />
                          {field.state.value
                            ? formatIsoDate(toIsoDate(field.state.value))
                            : "Pick a date"}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          if (!date) return
                          field.handleChange(date)
                          field.handleBlur()
                          setDateOpen(false)
                        }}
                        disabled={(date) => takenDates.has(toIsoDate(date))}
                      />
                    </PopoverContent>
                  </Popover>
                  {invalid && (
                    <FieldError id={errorId}>
                      {field.state.meta.errors[0]?.message}
                    </FieldError>
                  )}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="statementItems" mode="array">
            {(arrayField) => {
              const rows = arrayField.state.value
              const usedIds = new Set(rows.map((r) => r.itemId))
              const available = items.filter((item) => !usedIds.has(item.id))
              const arrayInvalid = !arrayField.state.meta.isValid

              const entries = rows.map((row, index) => ({
                row,
                index,
                item: itemsById.get(row.itemId),
              }))

              const groups = [
                {
                  type: "ASSET" as const,
                  legend: "Assets",
                },
                {
                  type: "LIABILITY" as const,
                  legend: "Liabilities",
                },
              ]

              return (
                <FieldSet>
                  <FieldLegend variant="label">Items</FieldLegend>
                  <FieldDescription>
                    Amount in euros, for example 1234,56
                  </FieldDescription>

                  {rows.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No items added
                    </p>
                  )}

                  {groups.map(({ type, legend }) => {
                    const groupEntries = entries.filter(
                      (entry) => entry.item?.type === type,
                    )
                    if (groupEntries.length === 0) return null

                    return (
                      <FieldSet key={type} className="gap-3">
                        <FieldLegend
                          variant="label"
                          className="mb-2 underline underline-offset-4"
                        >
                          {legend}
                        </FieldLegend>
                        {groupEntries.map(({ row, index, item }) => {
                          const amountId = `${baseId}-amount-${row.itemId}`
                          const amountErrorId = `${amountId}-error`
                          const itemErrorId = `${amountId}-item-error`

                          return (
                            <div key={row.itemId}>
                              <form.Field
                                name={`statementItems[${index}].amountCents`}
                              >
                                {(field) => {
                                  const invalid = !field.state.meta.isValid
                                  return (
                                    <div className="flex flex-col gap-1">
                                      <Field
                                        orientation="horizontal"
                                        data-invalid={invalid}
                                      >
                                        <FieldLabel
                                          htmlFor={amountId}
                                          className="flex-1"
                                        >
                                          {item?.name}
                                        </FieldLabel>
                                        <Input
                                          id={amountId}
                                          autoFocus={justAddedId === row.itemId}
                                          inputMode="decimal"
                                          placeholder="0,00"
                                          className="w-32 text-right tabular-nums"
                                          value={field.state.value}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                          onBlur={field.handleBlur}
                                          aria-invalid={invalid || undefined}
                                          aria-describedby={
                                            invalid
                                              ? `${amountErrorId} ${itemErrorId}`
                                              : undefined
                                          }
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="text-muted-foreground hover:text-destructive focus-visible:text-destructive"
                                          aria-label={`Remove ${item?.name}`}
                                          onClick={() =>
                                            arrayField.removeValue(index)
                                          }
                                        >
                                          <Trash2 />
                                        </Button>
                                      </Field>
                                      {invalid && (
                                        <FieldError id={amountErrorId}>
                                          {field.state.meta.errors[0]?.message}
                                        </FieldError>
                                      )}
                                    </div>
                                  )
                                }}
                              </form.Field>

                              <form.Field
                                name={`statementItems[${index}].itemId`}
                              >
                                {(field) =>
                                  !field.state.meta.isValid ? (
                                    <FieldError id={itemErrorId}>
                                      {field.state.meta.errors[0]?.message}
                                    </FieldError>
                                  ) : null
                                }
                              </form.Field>
                            </div>
                          )
                        })}
                      </FieldSet>
                    )
                  })}

                  {available.length > 0 && (
                    <Select
                      value={pendingItemId}
                      onValueChange={(id) => {
                        if (!id) return
                        arrayField.pushValue({ itemId: id, amountCents: "" })
                        setJustAddedId(id)
                        setPendingItemId("")
                      }}
                    >
                      <SelectTrigger className="max-w-max">
                        <SelectValue placeholder="Add an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {available.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {arrayInvalid && (
                    <FieldError>
                      {arrayField.state.meta.errors[0]?.message}
                    </FieldError>
                  )}
                </FieldSet>
              )
            }}
          </form.Field>
        </FieldGroup>
      </div>
      <form.Subscribe selector={(state) => state.errorMap.onSubmit?.form}>
        {(formError) =>
          formError ? <FieldError>{String(formError)}</FieldError> : null
        }
      </form.Subscribe>
      <DialogFooter>
        <DialogClose
          render={
            <Button type="button" variant="outline">
              Cancel
            </Button>
          }
        />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  )
}
