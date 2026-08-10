import "client-only"
import { createApi } from "../endpoints"

export const browserApi = createApi(() => "/api/v1")
