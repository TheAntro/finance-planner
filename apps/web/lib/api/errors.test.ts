import { describe, it, expect } from "vitest"
import { ApiError, describeError, NetworkError } from "./errors"

const defaultProblem = {
  type: "about:blank",
  title: "default error title",
  status: 500,
}

describe("api errors and helpers", () => {
  describe("describeError", () => {
    describe("ApiError", () => {
      it("should return problem detail when available", () => {
        const detail = "Test error detail"
        const problem = {
          ...defaultProblem,
          detail,
        }
        const error = new ApiError(
          problem,
          "http://localhost:3000/api/v1/statements",
        )
        expect(describeError(error)).toBe(detail)
      })

      it("should return problem title when detail is not available", () => {
        const title = "Test error title"
        const problem = {
          ...defaultProblem,
          title,
          detail: "",
        }
        const error = new ApiError(
          problem,
          "http://localhost:3000/api/v1/statements",
        )
        expect(describeError(error)).toBe(title)
      })

      it("should return fallback when neither detail nor title are available", () => {
        const fallback = "Fallback error message"
        const error = new ApiError(
          { ...defaultProblem, detail: "", title: "" },
          "http://localhost:3000/api/v1/statements",
        )
        expect(describeError(error, fallback)).toBe(fallback)
      })
    })

    describe("NetworkError", () => {
      it("should state that server could not be reached", () => {
        const error = new NetworkError(
          "http://localhost:3000/api/v1/statements",
        )
        expect(describeError(error)).toBe("Could not reach the server")
      })
    })

    describe("unknown error", () => {
      it("should return fallback description", () => {
        const fallback = "Test fallback error"
        expect(describeError(new Error("unknown error"), fallback)).toBe(
          fallback,
        )
      })

      it("uses an internal fallback for unknown errors if fallback is not provided", () => {
        expect(describeError(new Error("unknown error"))).toBe(
          "Something went wrong",
        )
      })
    })
  })
})
