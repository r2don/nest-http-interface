import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './global.vitest.ts',
    coverage: {
      provider: 'c8',
      reporter: 'lcov',
    },
  },
});
