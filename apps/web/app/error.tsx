"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error("Route error", { digest: error.digest, error })
  }, [error])
  return (
    <div>
      <h1>Oh no! There was an error</h1>
      <Button onClick={retry}>Try Again</Button>
      {error.digest && (
        <p className="text-sm text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
    </div>
  )
}
