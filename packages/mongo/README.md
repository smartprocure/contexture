# contexture-mongo
Mongo Provider for Contexture

## Overview
This library assumes you'll pass a native Mongo client. For example,
if you're using the package `mongo`, you would be passing the database object you get
right after calling `connect`.  Most of other MongoDB clients and
similar tools provide a way to access the native client.

## Usage
This provider takes a `config` object as a parameter, and expects a
`getClient` method to be provided, which should return an instantiated
MongoDB client.

| Option      | Type       | Description                                      | Required |
| ------      | ----       | -----------                                      | -------- |
| `getClient` | `function` | Returns an instantiated elasticsearch client     | x        |
| `types`     | `object`   | Contexture node types, like all other providers  |          |

### Schemas
Schemas using this mongo provider must specify a `collection` property,
which is the name of the collection it runs against.

| Option        | Type       | Description                                                 | Required |
| ------        | ----       | -----------                                                 | -------- |
| `collection`  | `string`   | The MongoDB collection that will be used to run the queries | x        |

### Example Schema for SomeMongoCollection

```js
module.exports = {
  mongo: {
    collection: 'SomeMongoCollection'
  }
}
```

### Seting up contexture
```js
let Contexture = require('contexture')
let provider = require('contexture-mongo')
let types = require('contexture-mongo/types')
let schemas = require('./path/to/schemas')

let process = Contexture({
  schemas,
  providers: {
    mongo: provider({
      getClient: () => client,
      types: types()
    })
  }
})
```

## Default Types

Requiring `contexture-mongo/types` and calling it as a function will allow you to use a
curated set of types we offer by default.
`contexture-mongo/types` allows you to pass a
customization object that will allow you to pass custom
parameters to the provided types.

### `mongoId`
`mongoId` is filter only and compares against a mongo id, which in mongoose needs to be cast.

### `text`
`text` is filter only and supports an array of `values`, a `join`, and an `operator` which it uses to construct a $regex filter.

The following operators are supported:

| Operator          | Description |
| ----------------- | ----------- |
| `containsWord`    | `/WORD/` (matches mid-word) |
| `containsExact`   | `/\bWORD\b/` (matches word in field) |
| `startsWith`      | `/^WORD/` |
| `endsWith`        | `/WORD$/` |
| `is`              | `/^WORD$/` (exact match) |
| `wordStartsWith`  | `/\bWORD/` |
| `wordEndsWith`    | `/WORD\b/` |

### `date`
`date` is filter only and converts `{from, to}` to a `{$gte, $lte}` mongo date filter.
It also supports `dateMath` via `@elastic/datemath` (the same as supported by elasticsearch) to provide time ranges as well as three custom strings `lastQuarter`, `thisQuarter`, and `nextQuarter` (which are calculated on the fly)

### `number`
### `exists`
### `facet`
### `results`

### `statistical`
`statistical` will produce a list of statistical values in the
`context` of the node. It does this by running `count: { $sum: 1 }`,
`$max`, `$min`, `$avg` and `$sum` after running other available
filters.

## Integration Tests

This repository offers integration tests to practice and understand the example
types we offer. You can run the integration tests with the command: `npm run test-integration`.
If you have a mongo database available at localhost (default port), the tests
will connect to it and do changes on a database named `contexture-test`.
