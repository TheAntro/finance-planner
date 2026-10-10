import { describe, expect, it } from "vitest"
import { isSessionExpiredError } from "./errors"

describe("isSessionExpiredError", () => {
  it("recognizes expired and missing sessions", () => {
    expect(isSessionExpiredError({ code: "oidc.invalid_grant" })).toBe(true)
    expect(isSessionExpiredError({ code: "not_authenticated" })).toBe(true)
  })

  it("returns false for other errors and unknown values", () => {
    expect(isSessionExpiredError(new Error("boom"))).toBe(false)
    expect(isSessionExpiredError(null)).toBe(false)
    expect(isSessionExpiredError(undefined)).toBe(false)
    expect(isSessionExpiredError({})).toBe(false)
  })
})
