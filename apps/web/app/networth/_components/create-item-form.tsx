import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useActionState, useId, useState } from "react"
import { browserApi } from "@/lib/api/browser"
import { itemKeys, ItemType, ApiError } from "@/lib/api"
import { Input } from "@/components/ui/input"

type FormState = {
  errors?: Record<string, string[]>
  message?: string
} | null

export function CreateItemForm({ onSuccess }: { onSuccess: () => void }) {
  const nameInputId = useId()
  const assetRadioId = useId()
  const liabilityRadioId = useId()
  const [name, setName] = useState("")
  const [type, setType] = useState<ItemType>("ASSET")

  const qc = useQueryClient()
  const { mutateAsync: createItem } = useMutation({
    mutationFn: browserApi.createItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: itemKeys.all }),
  })

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const name = String(formData.get("name") ?? "")
      const type = String(formData.get("type") ?? "") as ItemType

      try {
        await createItem({ name, type })
        onSuccess()
        return null
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.problem.errors)
            return {
              errors: e.problem.errors,
            }
          if (e.problem.status === 409)
            return {
              errors: {
                name: [e.problem.detail ?? "That name is already taken"],
              },
            }
          return {
            message: e.problem.detail,
          }
        }
        return {
          message: "Could not reach the server",
        }
      }
    },
    null,
  )

  return (
    <form action={formAction} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Add item</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label htmlFor={nameInputId}>Name</Label>
          <Input
            id={nameInputId}
            name="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {state?.errors?.name?.map((m) => (
            <FieldError key={m}>{m}</FieldError>
          ))}
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Type</FieldLegend>
          <RadioGroup
            className="flex gap-4"
            name="type"
            value={type}
            onValueChange={(v) => setType(v as ItemType)}
            required
          >
            {state?.errors?.type?.map((m) => (
              <FieldError key={m}>{m}</FieldError>
            ))}
            <Field orientation="horizontal" className="w-auto">
              <RadioGroupItem value="ASSET" id={assetRadioId} />
              <Label htmlFor={assetRadioId}>Asset</Label>
            </Field>
            <Field orientation="horizontal" className="w-auto">
              <RadioGroupItem value="LIABILITY" id={liabilityRadioId} />
              <Label htmlFor={liabilityRadioId}>Liability</Label>
            </Field>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
      {state?.message && <FieldError>{state.message}</FieldError>}
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </DialogFooter>
    </form>
  )
}
