import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./global.vitest.ts",
  },
});
