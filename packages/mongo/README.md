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
