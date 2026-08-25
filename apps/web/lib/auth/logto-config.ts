import "server-only"
import { required } from "@/lib/env/required"

export const apiResource = () => required("API_RESOURCE_URI")

export const logtoConfig = () => {
  const baseUrl = required("LOGTO_BASE_URL")
  return {
    endpoint: required("LOGTO_ENDPOINT"),
    appId: required("LOGTO_APP_ID"),
    appSecret: required("LOGTO_APP_SECRET"),
    baseUrl: required("LOGTO_BASE_URL"),
    cookieSecret: required("LOGTO_COOKIE_SECRET"),
    cookieSecure: baseUrl.startsWith("https://"),
    resources: [required("API_RESOURCE_URI")],
  }
}
