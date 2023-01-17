/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  maxWorkers: 1,
  maxConcurrency: 1,
  coverageReporters: ['clover'],
  collectCoverageFrom: ['src/**/*.js'],
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
}
