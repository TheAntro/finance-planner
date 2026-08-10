import { vi } from "vitest"

export function stubFetch(result: Response | Error) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      result instanceof Error
        ? Promise.reject(result)
        : Promise.resolve(result),
    ),
  )
}

export function rejection(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error("Expected promise to reject, but it resolved.")
    },
    (error) => error,
  )
}
