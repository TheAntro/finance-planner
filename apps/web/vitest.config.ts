import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const emptyModule = fileURLToPath(
  new URL("./test/empty-module.ts", import.meta.url),
)

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": emptyModule,
      "client-only": emptyModule,
    },
  },
  test: {
    environment: "node",
    restoreMocks: true,
    unstubGlobals: true,
    env: {
      TZ: "America/New_York",
      API_BASE_URL: "http://backend.test",
    },
  },
})
