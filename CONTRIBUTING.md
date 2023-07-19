# Contributor guide

#### Running commands

Commands can be run from the root or scoped to specific directories/workspaces

```bash
# From the root:
# > yarn {cmd} [dir]
# Ex:
yarn jest
yarn jest packages/client

# From inside package directory
# > cd packages/{dir} && yarn run -T {cmd}
# Ex:
cd packages/client && yarn run -T jest

# From any directory, specifying workspace
# > yarn workspace {workspace} run -T {cmd}
# Ex:
yarn workspace contexture-client run -T jest .
```

#### Tests

Tests can be scoped via `jest --selectProjects {project}`. Refer to [jest's config](./jest.config.js) for project names.

> :warning: You need `NODE_OPTIONS=--experimental-vm-modules` in your environment for `jest` to [parse ESM](https://jestjs.io/docs/28.x/ecmascript-modules#differences-between-esm-and-commonjs). Optionally, use [direnv](https://direnv.net/) for local setup of environment variables.

Example test command for client watch mode:
`NODE_OPTIONS=--experimental-vm-modules yarn jest packages/client/src/index.test.js --watch --verbose=false`

Example test command for provider-elasticsearch watch mode:
`NODE_OPTIONS=--experimental-vm-modules yarn jest packages/provider-elasticsearch/test/index.test.js --watch --verbose=false`
