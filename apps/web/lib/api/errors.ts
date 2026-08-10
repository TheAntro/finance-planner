import type { ProblemDetail } from "./types"

export class ApiError extends Error {
  readonly problem: ProblemDetail
  readonly url: string

  constructor(problem: ProblemDetail, url: string, options?: ErrorOptions) {
    super(problem.detail || problem.title || "Request failed", options)
    this.name = "ApiError"
    this.problem = problem
    this.url = url
  }
}

export class NetworkError extends Error {
  readonly url: string
  constructor(url: string, options?: ErrorOptions) {
    super(`Request to ${url} failed before a response was received`, options)
    this.name = "NetworkError"
    this.url = url
  }
}

export function describeError(
  error: unknown,
  fallback = "Something went wrong",
): string {
  switch (true) {
    case error instanceof ApiError:
      return error.problem.detail || error.problem.title || fallback
    case error instanceof NetworkError:
      return "Could not reach the server"
    default:
      return fallback
  }
}
