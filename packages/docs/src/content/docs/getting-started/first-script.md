---
title: First Script
---

With everything installed, let's see a simple script that runs a
simple one-time search:

```javascript
let contexture = require('contexture')

let schemas = {
  collectionNameSchema: {
    mongo: {
      collection: 'collectionName',
    },
  },
}

let searchTree = {
  key: 'root',
  type: 'group',
  schema: 'collectionNameSchema',
  children: [
    {
      key: 'namequery',
      type: 'text',
      field: 'name',
      operator: 'containsWord',
      value: 'text we want to match on the field name',
    },
    {
      key: 'results',
      type: 'results',
    },
  ],
}

let result = await contexture(
  {
    schemas,
    providers: {
      mongo: require('contexture-mongo')({
        types: require('contexture-mongo/types')(),
        getClient: () => ({
          // Fake mongo client.
          // For this example we only care about
          // collection().aggregate([...]).toArray() being a promise.
          collection: (name) => ({
            aggregate: (aggregations) => ({
              toArray: async () => ['Unrealistic result example'],
            }),
          }),
        }),
      }),
    },
  },
  searchTree
)

console.log(result.children[1].context.response.results)

// Explore it yourself!
result
```

You can also try this same code in Runkit here:
<https://runkit.com/sadasant/your-first-contexture-script>

## What it does

1. Requiring Contexture

```javascript
let contexture = require('contexture')
```

We start by requiring `contexture`. There's nothing much else to see
here.

![Random but cute gif taken out of Google](https://i.chzbgr.com/full/6410885376/hC6033E5D/)

2. Writing the Schemas

```javascript
let schemas = {
  collectionNameSchema: {
    mongo: {
      collection: 'collectionName',
    },
  },
}
```

Immediatly afterwards, we define our schemas. For this specific
example, we are going to emulate doing a search on a single collection
of a Mongo database. We define `collectionName` as the name of this
arbitrary collection. The `schemas` object ends up containing a single
schema with a key being `collectionNameSchema`, which is going to be
supported by a single provider `mongo`, from which we'll be looking
for the `collectionName` collection. We'll learn more about the
schemas later on, in [Querying → Schemas](../querying/schemas.md).

3. Writing the Contexture DSL

```javascript
let searchTree = {
  key: 'root',
  type: 'group',
  schema: 'collectionNameSchema',
  children: [
    {
      key: 'namequery',
      type: 'text',
      field: 'name',
      operator: 'containsWord',
      value: 'text we want to match on the field name',
    },
    {
      key: 'results',
      type: 'results',
    },
  ],
}
```

Our next step is to define a simple search query using Contexture DSL.
This search query will have a mandatory root group, which among other
features indicates which schema we will be running this query on
(`collectionNameSchema`). This node will have two children. The first
children is going to be our search query. This query will be a `text`
type query. We're indicating that we want to run a plain text search
that will try to match any record which `name` contains the word
`value`. The next node has the `results` type. This is where the
results will be written once the search runs.

You can read more about these topics in the following links:

- [Querying](../querying/README.md).
- [Types and Type Components](../types/README.md).
- [Mongo Example Types](../types/mongo-example-types.md).

3. Getting Results

```javascript
let result = await contexture(
  {
    schemas,
    providers: {
      mongo: require('contexture-mongo')({
        types: require('contexture-mongo/types')(),
        getClient: () => ({
          // Fake mongo client.
          // For this example we only care about
          // collection().aggregate([...]).toArray() being a promise.
          collection: (name) => ({
            aggregate: (aggregations) => ({
              toArray: async () => ['Unrealistic result example'],
            }),
          }),
        }),
      }),
    },
  },
  searchTree
)
```

The next thing we do is to actually run a one-time search. In this
case, we `await` for `contexture`, passing along some very important
parameters. First, we pass the schemas we previously defined. Then, we
pass a providers object, which has the provider for `mongo`. This
`mongo` key will be matched against the `mongo` key that we defined in
the schemas, so you could change this property name to something
entirely different. When we send the mongo provider, we assign the
result of the initialization of `contexture-mongo`, where we send the
`contxture-mongo/types` (which **needs to be called as a function once
required**) and a `getClient` function. In a real schenario, you would
just send the object that results of `require('mongodb')`. However, to
provide an exceutable example in the browser, we've made a very small
Mock of MongoDB where we will return a same object for any collection
call, which will only allow fake aggregations, which will have a
promise `toArray` function that will return our `Unrealistic result
example`.

Keep in mind that since `contexture` returns a promise, you can change
`await contexture({ /* .. */ })` to `contexture({ /* .. */ }).then()`,
but you'll need to move the code that we have after the await call
into the function that is passed on the `.then()` call.

You can read more about these concepts here:

- [Querying](../querying/README.md).
- [Contexture Providers](../under-the-hood/contexture-providers/README.md).
- Contexture Core's [Default Export](../under-the-hood/contexture-core.md#default-export).

4. Exploring the Results

```javascript
console.log(result.children[1].context.response.results)

// Explore it yourself!
result
```

Finally, we can use our search result! The output of the search will
be added to a copy of the original search query. The location of this
result will be in the children of the `root` node that has the
`results` type, within a `context` object, within a `response` object,
on a `results` property. This whole object is going to be exposed in
the _runkit_ example for you to play with it. For more information,
you can dive in here:

- [Contexture DSL](../querying/contexture-dsl.md).
- [Design Principles](../under-the-hood/design-principles.md).
- [Contexture Core](../under-the-hood/contexture-core.md)
