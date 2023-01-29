# Contexture monorepo

#### Running commands

Commands can be run from the root or scoped to specific directories/workspaces

```bash
# From the root
yarn run {cmd}
# From workspace
yarn workspace {workspace} run -T {cmd}
# From directory
cd packages/{dir} && yarn run -T {cmd}

# Examples
yarn run jest .
yarn workspace contexture-client run -T eslint .
cd packages/client && yarn run prettier -w .
```

Additionally, tests can be scoped via `jest --selectProjects {project}`. Refer to [jest's config](./jest.config.js) for project names.

> :warning: You need `NODE_OPTIONS=--experimental-vm-modules` in your environment for `jest` to [parse ESM](https://jestjs.io/docs/28.x/ecmascript-modules#differences-between-esm-and-commonjs). Optionally, use [direnv](https://direnv.net/) for local setup of environment variables.
