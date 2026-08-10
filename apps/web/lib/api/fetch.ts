import { ApiError, NetworkError } from "./errors"
import type { ProblemDetail } from "./types"

async function toProblem(response: Response): Promise<ProblemDetail> {
  try {
    return await response.json()
  } catch {
    return {
      type: "about:blank",
      title: response.statusText || "Request failed",
      status: response.status,
      detail: `Non-JSON error response (${response.status})`,
    }
  }
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (cause) {
    throw new NetworkError(url, { cause })
  }
  if (!response.ok) {
    const problem = await toProblem(response)
    throw new ApiError(problem, url)
  }
  return response
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await request(url, init)
  return response.json()
}

export async function fetchNoContent(
  url: string,
  init?: RequestInit,
): Promise<void> {
  const response = await request(url, init)
  await response.body?.cancel()
}
