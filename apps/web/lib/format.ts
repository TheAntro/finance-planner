import type { ItemType } from "./api/types"
import { LOCALE } from "./constants"

const date = new Intl.DateTimeFormat(LOCALE, {
  timeZone: "UTC",
  dateStyle: "medium",
})

export function formatIsoDate(iso: string) {
  return date.format(new Date(iso))
}

export function toIsoDate(date: Date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  ASSET: "Asset",
  LIABILITY: "Liability",
}

export function formatItemType(type: ItemType) {
  return ITEM_TYPE_LABELS[type]
}
