import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: '.',
  test: {
    coverage: {
      reporter: ['lcov'],
      include: ['packages/*/src/**/*.js'],
    },
  },
})
