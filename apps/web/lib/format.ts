import type { ItemType } from "./api/types"

const LOCALE = "fi-FI"

const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
})
const date = new Intl.DateTimeFormat(LOCALE, {
  timeZone: "UTC",
  dateStyle: "medium",
})

export function formatCents(cents: number) {
  return currency.format(cents / 100)
}

export function formatIsoDate(iso: string) {
  return date.format(new Date(iso))
}

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  ASSET: "Asset",
  LIABILITY: "Liability",
}

export function formatItemType(type: ItemType) {
  return ITEM_TYPE_LABELS[type]
}
