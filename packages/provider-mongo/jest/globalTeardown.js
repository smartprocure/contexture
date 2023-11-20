// https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

export default async () => {
  if (globalThis.__mongoServer) {
    await globalThis.__mongoServer.stop()
  }
}
