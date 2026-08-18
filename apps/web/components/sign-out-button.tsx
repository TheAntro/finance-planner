"use client"

import { Button } from "./ui/button"

export function SignOutButton({
  onSignOut,
}: {
  onSignOut: () => Promise<void>
}) {
  return (
    <Button
      variant="default"
      onClick={() => {
        onSignOut()
      }}
    >
      Sign Out
    </Button>
  )
}
