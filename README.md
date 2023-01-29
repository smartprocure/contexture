# Contexture monorepo

## Linting:

```bash
yarn run eslint . # Top level
cd packages/<name> && yarn run -T eslint . # By dir name
yarn workspace <name> run -T eslint . # By workspace name
```

## Formatting

```bash
yarn run prettier -w . # Top level
cd packages/<name> && yarn run -T prettier -w . # By dir name
yarn workspace <name> run -T prettier -w . # By workspace name
```

## Testing

```bash
yarn run test # Top level
yarn run test --selectProjects <name> # By project
```
