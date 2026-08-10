import type { components } from "./schema.gen"

export type ItemResponse = components["schemas"]["ItemResponse"]
export type StatementResponse = components["schemas"]["StatementResponse"]
export type ItemType = ItemResponse["type"]
export type CreateItemRequest = components["schemas"]["CreateItemRequest"]

// errors for the API are not visible in springdoc generated API documentation, so we need to define them here
// `errors` map 400 errors
// `itemIds` are missing ids generated from ApiExceptionsHandler
export type ProblemDetail = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
  itemIds?: string[]
}
