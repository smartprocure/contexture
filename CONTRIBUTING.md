# Contributor guide

#### Running commands

Commands can be run from the root or scoped to specific directories/workspaces

```bash
# From the root:
# > yarn {cmd} [dir]
# Ex:
yarn test
yarn test packages/client

# From inside package directory
# > cd packages/{dir} && yarn run -T {cmd}
# Ex:
cd packages/client && yarn run -T test

# From any directory, specifying workspace
# > yarn workspace {workspace} run  {cmd}
# Ex:
yarn workspace contexture-client run test .
```

#### Tests

Tests can be scoped via `vitest --project {project}`. Refer to [vitest's workspaces](./vitest.workspace.ts) for project names.

