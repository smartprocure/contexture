# Contexture monorepo

#### Packages

| Github                                                      | npm                                                                                | Description                                                                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [server](./packages/server)                                 | [contexture](https://www.npmjs.com/package/contexture-elasticsearch)               | The server library that exectues the DSL to retrieve data                                                         |
| [provider-elasticsearch](./packages/provider-elasticsearch) | [contexture-elasticsearch](https://www.npmjs.com/package/contexture-elasticsearch) | Elasticsearch provider for contexture                                                                             |
| [provider-mongo](./packages/provider-mongo)                 | [contexture-mongo](https://www.npmjs.com/package/contexture-mongo)                 | MongoDB provider for contexture                                                                                   |
| [client](./packages/client)                                 | [contexture-client](https://www.npmjs.com/package/contexture-client)               | The client library that manages the DSL, allowing for hyper efficient updates running only what is exactly needed |
| [react](./packages/react)                                   | [contexture-react](https://www.npmjs.com/package/contexture-react)                 | React components for building contexture interfaces                                                               |
| [export](./packages/export)                                 | [contexture-export](https://www.npmjs.com/package/contexture-export)               | Export searches into files or any other target                                                                    |

#### Ecosystem And Resources

- [Elasticon 2018 Talk About Contexture](http://github.com/smartprocure/contexture-ec18-talk)

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
