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
      displayName: 'core',
      testMatch: ['<rootDir>/packages/core/src/**/*.test.js'],
    },
    {
      displayName: 'elasticsearch',
      testMatch: ['<rootDir>/packages/elasticsearch/test/**/*.test.js'],
    },
    {
      displayName: 'export',
      testMatch: ['<rootDir>/packages/export/src/**/*.test.js'],
    },
    {
      displayName: 'mongo',
      testMatch: ['<rootDir>/packages/mongo/test/**/*.js'],
    },
    // TODO: Fix tests
    // {
    //   displayName: 'mongo:integration',
    //   testMatch: [
    //     '<rootDir>/packages/mongo/integration-test/example-types/**/*.js',
    //   ],
    // },
  ],
}
