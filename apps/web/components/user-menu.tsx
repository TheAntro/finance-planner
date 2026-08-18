import { logtoConfig } from "@/lib/auth/logto-config"
import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions"
import { SignOutButton } from "./sign-out-button"
import { SignInButton } from "./sign-in-button"

export async function UserMenu() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig())
  return isAuthenticated ? (
    <SignOutButton
      onSignOut={async () => {
        "use server"

        await signOut(logtoConfig())
      }}
    />
  ) : (
    <SignInButton
      onSignIn={async () => {
        "use server"

        await signIn(logtoConfig())
      }}
    />
  )
}
