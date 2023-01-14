/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/test/**/*.js'],
      transform: {
        '^.+\\.js?$': ['esbuild-jest', { sourcemap: true, target: 'es2022' }],
      },
      coverageProvider: 'v8',
      coverageReporters: ['clover'],
      collectCoverageFrom: ['src/**/*.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/integration-test/example-types/**/*.js'],
      transform: {
        '^.+\\.js?$': ['esbuild-jest', { sourcemap: true, target: 'es2022' }],
      },
      coverageProvider: 'v8',
      coverageReporters: ['clover'],
      collectCoverageFrom: ['integration-test/**/*.js'],
      maxConcurrency: 1,
      maxWorkers: 1,
    },
  ],
}
