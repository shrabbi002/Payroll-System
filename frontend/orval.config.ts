import { defineConfig } from "orval";

/**
 * Orval configuration for generating typed API hooks from
 * the Django Ninja OpenAPI schema.
 *
 * Usage:
 *   npx orval --config ./orval.config.ts
 *
 * Prerequisites:
 *   - The Django backend must be running and serving the OpenAPI schema
 *   - Update the 'input' URL to match your backend's schema endpoint
 */
export default defineConfig({
  payrollApi: {
    input: {
      // Point this to your running Django Ninja OpenAPI schema endpoint
      target: "http://localhost:8000/api/v1/openapi.json",
    },
    output: {
      // Generated hooks and types will be placed here
      target: "./src/lib/api/generated.ts",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./src/lib/api-client.ts",
          name: "apiClient",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
