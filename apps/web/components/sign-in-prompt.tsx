import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { SignInButton } from "./sign-in-button"
import { signIn } from "@logto/next/server-actions"
import { logtoConfig } from "@/lib/auth/logto-config"

export async function SignInPrompt() {
  return (
    <div className="grid h-full w-full place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Protected Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your financial data is private and secure.</p>
          <SignInButton
            onSignIn={async () => {
              "use server"

              await signIn(logtoConfig())
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
