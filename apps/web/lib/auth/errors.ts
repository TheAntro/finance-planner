import "server-only"

const SESSION_EXPIRED_CODES = new Set([
  "oidc.invalid_grant",
  "not_authenticated",
])

export function isSessionExpiredError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code
  return typeof code === "string" && SESSION_EXPIRED_CODES.has(code)
}
