// https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

import { MongoMemoryServer } from 'mongodb-memory-server'

export  const setup  = async () => {
  globalThis.__mongoServer = await MongoMemoryServer.create()
  // Each test file has its own environment with its own `global` instance so
  // we need to use the process environment.
  process.env.VITE_MONGO_URI = global.__mongoServer.getUri()
}

// https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

export const teardown = async () => {
  if (globalThis.__mongoServer) {
    await globalThis.__mongoServer.stop()
  }
}
