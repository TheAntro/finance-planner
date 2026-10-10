import "server-only"
import { signIn } from "@logto/next/server-actions"
import { isSessionExpiredError } from "./errors"
import { logtoConfig } from "./logto-config"
import { getApiTokenRSC } from "./tokens"

/** Returns a valid API token, starting a fresh Logto interaction for dead sessions. */
export async function requireApiToken(): Promise<string> {
  try {
    return await getApiTokenRSC()
  } catch (error) {
    if (isSessionExpiredError(error)) {
      // signIn redirects to Logto and replaces the stale session interaction.
      await signIn(logtoConfig())
    }
    throw error
  }
}
