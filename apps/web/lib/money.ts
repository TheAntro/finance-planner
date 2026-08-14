import z from "zod"
import { LOCALE } from "./constants"
const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
})

export function formatCents(cents: number) {
  return currency.format(cents / 100)
}

export const amountToCents = z
  .string()
  .regex(/^\d+([.,]{1,2})?$/, "Enter an amount like 1234,56")
  .transform((v) => Math.round(parseFloat(v.replace(",", ".")) * 100))
