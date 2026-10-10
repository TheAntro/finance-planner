import { signIn } from "@logto/next/server-actions"
import { logtoConfig } from "@/lib/auth/logto-config"

export async function GET() {
  await signIn(logtoConfig())
  return new Response(null)
}
