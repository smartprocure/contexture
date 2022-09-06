/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testMatch: ['<rootDir>/test/**/*.js'],
  coverageReporters: ['json'],
  collectCoverageFrom: ['src/**/*.js'],
}
