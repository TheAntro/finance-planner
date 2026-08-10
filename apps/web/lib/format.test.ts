import { describe, it, expect } from "vitest"
import { formatIsoDate } from "./format"
describe("formatters", () => {
  describe("formatIsoDate", () => {
    it("should format the date correctly in a negative from UTC timezone", () => {
      expect(formatIsoDate("2026-08-10")).toBe("10.8.2026")
    })
  })
})
