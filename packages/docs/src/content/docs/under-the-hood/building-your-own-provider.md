---
title: Building your own provider
---

Writing a new provider consists of writing a function (or class or
any other approach you might like), that will receive a configuration
object with at least the following properties:

| Property Name | Type       | Description                                                                                                                                                                                                                                                                   |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types`       | `Object`   | See the example-types in [contexture-elasticsearch](https://github.com/smartprocure/contexture-elasticsearch) and [contexture-mongo](https://github.com/smartprocure/contexture-mongo). More information on our detailed docs about [Contexture Types](../types/diy-types.md) |
| `getClient`   | `Function` | A function that returns the main database client that you will be using.                                                                                                                                                                                                      |

You might also add any new property if your provider needs it for
processing the searches.

The main provider function is expected to return an Object with:

| Property Name                                             | Type                  | Description                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types`                                                   | `Object`              | See the example-types in [contexture-elasticsearch](https://github.com/smartprocure/contexture-elasticsearch) and [contexture-mongo](https://github.com/smartprocure/contexture-mongo). More information on our detailed docs about [Contexture Types](../types/diy-types.md) |
| `groupCombinator(group, filters)`                         | `Function`            | A function that returns a valid query for grouping individual aggregations. More on that below.                                                                                                                                                                               |
| `runSearch(options = {}, context, schema, filters, aggs)` | `Function -> Promise` | A function that will be responsible for running each one of the individual searches that the types in the Contexture DSL might indicate. More on that below.                                                                                                                  |

### Group Combinator Function

The `groupCombinator` function is used to transform an incoming query
into the underlying database's group combinator. It receives a `group`
Object that contains a property `join`, which indicates which boolean
operation wants to be used. The `join` values we use are `and`, `or`
and `not`, but you can specify any `join` value for your provider, as
long as you make sure the resulting query is valid. The result should
be a native database query structure with the given `filters` within a
boolean operator. For example, in ElasticSearch, this means:

| Boolean Operation | ElasticSearch Combinator                                 |
| ----------------- | -------------------------------------------------------- |
| `and`             | `{ bool: { must: filters } }`                            |
| `or`              | `{ bool: { should: filters, minimum_should_match: 1 } }` |
| `not`             | `{ bool: { must_not: filters } }`                        |

However, in MongoDB, this is how it works:

| Boolean Operation | MongoDB Combinator  |
| ----------------- | ------------------- |
| `and`             | `{ $and: filters }` |
| `or`              | `{ $or: filters }`  |
| `not`             | `{ $nor: filters }` |

### Run Search Function

The `runSearch` function will run each search that is indicated by the
Contexture DSL. It receives several parameters:

| Property Name | Type     | Description                                                                                                    |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `options`     | `Object` | Object that is sent as the last parameter to the main `Contexture` call.                                       |
| `context`     | `Object` | The current node that is triggering the search.                                                                |
| `schema`      | `Object` | The schema that is related to this node or root. Usually assigned at the root of the search tree.              |
| `filters`     | `Array`  | The filters that have resulted from parsing this node and it's children.                                       |
| `aggs`        | `Array`  | Any other aggregation that might have been received from previous processing operations of the Contexture DSL. |

In this function, you should call to the `getClient` function that the
provider originally received, then you should accomodate the incoming
`filters` and `aggs` into the final query that will be sent to the
client's aggregation method. Since you'll have the schema, you'll be
able to get the information you need for your specific database with
`schema.myDatabase.myProperty`.

The final search query should be an Object and should be pushed into
the `context._meta.requests` array, for debugging purposes. Once you have
the result, you should also add it to the final query object, so that
it can be accessible by reading the context path, then
`_meta.requests[index].response`, where `index` is the position where
the final query lives. For example:

```javascript
let request = {
  /* My Database DSL Object */
}

context._meta.requests.push(request)

let result = Promise.resolve(databaseClient(request))

return result.tap((results) => {
  request.response = results
})
```
