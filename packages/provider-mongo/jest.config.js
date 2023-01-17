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
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/integration-test/example-types/**/*.js'],
    },
  ],
  coverageProvider: 'v8',
  coverageReporters: ['clover'],
  collectCoverageFrom: ['src/**/*.js'],
  maxConcurrency: 1,
  maxWorkers: 1,
}
