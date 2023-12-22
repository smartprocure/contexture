---
title: Contexture Core
---

The core of Contexture is a package of its own. Located at [github.com/smartprocure/contexture](https://github.com/smartprocure/contexture), it offers the very underlying function that is designed to process every one of the search queries. It begins with a simple curried function which, once the providers and the schemas are received, proceeds to process the [Contexture DSL](#TODO) by walking down the given search tree, cleaning up every node of possible inconsistencies, then mutating the tree with the directions given by the provider types and schemas, up until a valid search query is obtained. This query is delivered to the provider `runSearch` method, and the result is finally added back to the tree.

With this in mind, let's get some specifications.

## Default Export

Contexture's default export is a function that receives a total of three parameters, where the first two parameters are curried.

The first argument is expected to be a plain JavaScript Object with two keys:

- `providers`: Should be an object where each key will have a [Contexture Provider](#TODO).
- `schemas`: Should be an object where each key will have a [Contexture Schema](#TODO).

Calling this function with this object only will return another function, which can be used as an asynchronous search runner. You can also pass in all the arguments as once, but the separation of parameters makes it easier to scope setting up the database providers, the types and the schemas from the search execution.

Example declaration of a search function by passing the schema & providers object first:

```javascript
const search = Contexture({
  schemas: {
    ...mongoSchemas,
    ...elasticSearchSchemas,
  },
  providers: {
    mongo: require('contexture-mongo')({
      /* provider configuration */
    }),
    elasticsearch: require('contexture-elasticsearch')({
      /* provider configuration */
    }),
  },
})

// How you might use it with an express-like API:
//   app.use('/search', async req, res) =>
//     res.send(await search(req.body.search))
```

The other two parameters are the search tree (the [Contexture
DSL](#TODO)), and an optional object that will be sent along to the
provider's `runSearch` function as the first parameter, that can
contain any property, but that should at least contain the following
properties:

| Option     | Description                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `debug`    | Sends `_meta` as part of the response, which includes per node request records, relevant filters, and other debug info.                            |
| `onResult` | A callback which is called whenever a node finishes producing it's results, which can be used to send partial results over websockets for example. |

This function, called at least up to the DSL search tree, will return a copy of the given search tree, filled with both properties needed to run the search, but also with the search results, which are assigned in the tree based on each one of the types that each specific search might be using. For more about how this happens, check out the [Contexture Types](#TODO).
