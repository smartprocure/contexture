/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testMatch: ['<rootDir>/test/**/*.js'],
  transform: { '^.+\\.js?$': 'jest-esbuild' },
}
