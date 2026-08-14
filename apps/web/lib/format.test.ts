import { describe, it, expect } from "vitest"
import { formatIsoDate, toIsoDate } from "./format"

describe("formatters", () => {
  describe("formatIsoDate", () => {
    it("should format the date correctly in a negative from UTC timezone", () => {
      expect(formatIsoDate("2026-08-10")).toBe("10.8.2026")
    })
  })
  describe("toIsoDate", () => {
    it("should convert a date to an ISO date string correctly in a negative timezone", () => {
      expect(toIsoDate(new Date(2026, 7, 10))).toBe("2026-08-10")
    })
  })
})
