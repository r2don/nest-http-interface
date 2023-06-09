import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    setupFiles: './global.vitest.ts',
    coverage: {
      provider: 'v8',
      reporter: 'lcov',
    },
  },
});
