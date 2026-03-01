import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:8080/swagger/json",
    output: {
      mode: "tags-split",
      target: "./src/lib/services",
      client: "react-query",
      schemas: "./src/lib/schemas",
      mock: false,
      override: {
        mutator: {
          path: "./src/lib/api/axiosInstance.ts",
          name: "defaultMutator",
        },
      },
    },
  },
});
