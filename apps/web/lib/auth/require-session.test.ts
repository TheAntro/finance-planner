import { beforeEach, describe, expect, it, vi } from "vitest"

const { getApiTokenRSC, signIn, logtoConfig } = vi.hoisted(() => ({
  getApiTokenRSC: vi.fn(),
  signIn: vi.fn(),
  logtoConfig: vi.fn(() => ({ appId: "test-app" })),
}))

vi.mock("./tokens", () => ({ getApiTokenRSC }))
vi.mock("./logto-config", () => ({ logtoConfig }))
vi.mock("@logto/next/server-actions", () => ({ signIn }))

import { requireApiToken } from "./require-session"

describe("requireApiToken", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the token when the session is live", async () => {
    getApiTokenRSC.mockResolvedValue("access-token")

    await expect(requireApiToken()).resolves.toBe("access-token")
    expect(signIn).not.toHaveBeenCalled()
  })

  it("starts a fresh sign-in for a dead session and preserves its redirect", async () => {
    const redirect = new Error("Logto redirect")
    getApiTokenRSC.mockRejectedValue({ code: "oidc.invalid_grant" })
    signIn.mockRejectedValue(redirect)

    await expect(requireApiToken()).rejects.toBe(redirect)
    expect(signIn).toHaveBeenCalledWith(logtoConfig())
  })

  it("rethrows unrelated errors without starting sign-in", async () => {
    const failure = new Error("backend unavailable")
    getApiTokenRSC.mockRejectedValue(failure)

    await expect(requireApiToken()).rejects.toBe(failure)
    expect(signIn).not.toHaveBeenCalled()
  })
})
