import "server-only"

export function backendOrigin() {
  const origin = process.env.API_BASE_URL
  if (!origin) {
    throw new Error("API_BASE_URL is not set")
  }
  return origin
}
