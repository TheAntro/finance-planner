import { required } from "@/lib/env/required"
import "server-only"

export function backendOrigin() {
  return required("API_BASE_URL")
}
