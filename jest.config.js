/* https://jestjs.io/docs/configuration */

export default {
  coverageProvider: 'v8',
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.js',
    '!<rootDir>/packages/*/src/**/*.test.js',
  ],
  reporters: ['default', ['github-actions', { silent: false }]],
  projects: [
    {
      displayName: 'client',
      testMatch: ['<rootDir>/packages/client/src/**/*.test.js'],
    },
    {
      displayName: 'server',
      testMatch: ['<rootDir>/packages/server/src/**/*.test.js'],
    },
    {
      displayName: 'provider-elasticsearch',
      testMatch: ['<rootDir>/packages/provider-elasticsearch/src/**/*.test.js'],
    },
    {
      displayName: 'export',
      testMatch: ['<rootDir>/packages/export/src/**/*.test.js'],
    },
    {
      displayName: 'provider-mongo',
      testMatch: ['<rootDir>/packages/provider-mongo/src/**/*.test.js'],
      globalSetup: './packages/provider-mongo/jest/globalSetup.js',
      globalTeardown: './packages/provider-mongo/jest/globalTeardown.js',
    },
  ],
}
