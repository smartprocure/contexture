import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'client',
      include: ['packages/client/src/**/*.test.js'],
    },
  },
  {
    test: {
      name: 'server',
      include: ['packages/server/src/**/*.test.js'],
    },
  },
  {
    test: {
      name: 'provider-elasticsearch',
      include: ['packages/provider-elasticsearch/src/**/*.test.js'],
    },
  },
  {
    test: {
      name: 'export',
      include: ['packages/export/src/**/*.test.js'],
    },
  },
  {
    test: {
      name: 'provider-mongo',
      include: ['packages/provider-mongo/src/**/*.test.js'],
      globalSetup: './packages/provider-mongo/test/globalSetup.js',
    },
  },
  {
    test: {
      name: 'util',
      include: ['packages/util/src/**/*.test.js'],
    },
  },
])
