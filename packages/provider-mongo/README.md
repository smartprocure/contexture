# contexture-mongo
Mongo Provider for Contexture

## Overview
This library assumes mongoose, but can easily be extended to support anything that can handle native mongo aggregations.

## Usage
This provider takes a config object as a parameter, and expects a `getMongooseClient` method to be provided, which should be an instantiated mongoose client.

Schemas using this mongo provider must specify a `model` property, which is which collection (mongoose model) it runs against.

### Example Schema for SomeMongoCollection

```js
module.exports = {
  mongo: {
    model: 'SomeMongoCollection'
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
      getMongooseClient: () => mongoose,
      types
    })
  }
})
```

## Default Types

### `mongoId`
`mongoId` is filter only and compares against a mongo id, which in mongoose needs to be cast.

### `text`
`text` is filter only and supports an array of values, a join, and an operator which it uses to construct a $regex filter.

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
