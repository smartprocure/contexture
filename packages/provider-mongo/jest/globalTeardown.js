// https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

export default async () => {
  await global.__mongoServer.stop()
}
