"use client"

import { Button } from "./ui/button"

export function SignInButton({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <Button
      variant="default"
      onClick={() => {
        onSignIn()
      }}
    >
      Sign In
    </Button>
  )
}
