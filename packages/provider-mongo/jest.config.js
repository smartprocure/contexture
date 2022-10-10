/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/test/**/*.js'],
      coverageReporters: ['clover'],
      collectCoverageFrom: ['src/**/*.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/integration-test/example-types/**/*.js'],
      coverageReporters: ['clover'],
      collectCoverageFrom: ['integration-test/**/*.js'],
      maxConcurrency: 1,
      maxWorkers: 1,
    },
  ],
}
