// https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

import { MongoMemoryServer } from 'mongodb-memory-server'

export default async (jestConfig, projectConfig) => {
  if (projectConfig.displayName.name === 'provider-mongo') {
    globalThis.__mongoServer = await MongoMemoryServer.create()
    // Each test file has its own environment with its own `global` instance so
    // we need to use the process environment.
    process.env.MONGO_URI = global.__mongoServer.getUri()
  }
}
