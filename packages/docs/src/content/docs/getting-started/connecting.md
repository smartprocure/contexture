---
title: Connecting
---

Our primary use case for advanced search interfaces is to query data
that we store on ElasticSearch and MongoDB. Because of that, we
provide two contexture libraries for those databases. In this page
we'll examine how to use these repositories to connect to existing
Mongo databases and ElasticSearch indexes.

### Connecting to ElasticSearch

The followng code example shows how to connect to ElasticSearch:

```javascript
let Contexture = require('contexture')
let provider = require('contexture-elasticsearch')
let types = require('contexture-elasticsearch/types')
let elasticsearch = require('elasticsearch')
let AgentKeepAlive = require('agentkeepalive')

let elasticClient = null
let getClient = () => {
  if (elasticClient) return elasticClient
  elasticClient = elasticsearch.Client({
    minSockets: 1,
    maxSockets: 20,
    keepAlive: true,
    createNodeAgent: (connection, config) =>
      new AgentKeepAlive(connection.makeAgentConfig(config)),
  })
  return elasticClient
}

let schemas = {
  yourCustomSchemaName: {
    elasticsearch: {
      index: 'SomeIndex',
      type: 'SomeType',
    },
  },
}

let search = Contexture({
  schemas,
  providers: {
    elasticsearch: provider({
      getClient,
      request: {
        headers: {
          'custom-header-app-name': 'my-app-sent-this',
        },
      },
      types: types(),
    }),
  },
})
```

The code above will provide a working search function `search` that
will transform any given query into a working ElasticSearch query,
which will be sent to the database to retrieve the data. Let's examine
this code in greater detail.

1. The Dependencies

```javascript
let Contexture = require('contexture')
let provider = require('contexture-elasticsearch')
let types = require('contexture-elasticsearch/types')
let elasticsearch = require('elasticsearch')
let AgentKeepAlive = require('agentkeepalive')
```

The first six lines are about requiring dependencies, the first
dependency being just `contexture`. The second one is our database
provider, `contexture-elasticsearch`. Then, we require the types; even
though you will probably have to write your own types, we have some
pre-defined types available at `contexture-elasticsearch/types`.
Lastly, we require `elasticsearch` and `agentkeepalive`, so we can
actually connect to ElasticSearch and keep it connected even if the
address becomes unreachable for a while.

Please feel free to dig around these topics by following these links:

- [Contexture Providers](under-the-hood/contexture-providers/README.md).
- [Types and Type Components](types/README.md).
- [ElasticSearch.js](https://github.com/elastic/elasticsearch-js).
- [AgentKeepAlive](https://github.com/node-modules/agentkeepalive).

2. The ElasticSearch Client

```javascript
let elasticClient = null
let getClient = () => {
  if (elasticClient) return elasticClient
  elasticClient = elasticsearch.Client({
    minSockets: 1,
    maxSockets: 20,
    keepAlive: true,
    createNodeAgent: (connection, config) =>
      new AgentKeepAlive(connection.makeAgentConfig(config)),
  })
  return elasticClient
}
```

Now, we define a utility function to connect to ElasticSearch just
once. The idea here is to be able to re-use the same connection
instead of using new clients every time a search is executed. We do
this by declaring a function that will return `elasticClient` if it has
a truthy value, or otherwise instantiate a new elasticsearch client
with the given configuration. The configuration we are sending is
merely an example and shouldn't be used without understanding what is
being expected by the elasticsearch library. More on the following
links:

- [ElasticSearch.js docs on configuration](https://github.com/elastic/elasticsearch-js/blob/master/docs/configuration.asciidoc).

3. The Schemas

```javascript
let schemas = {
  elasticsearch: {
    index: 'SomeIndex',
    type: 'SomeType',
  },
}
```

As shown above, the next thing we do is to define the schemas. This is
an object which properties are the names of each one of the schemas
that will be available for the contexture DSL. The schemas for the
ElasticSearch provider can specify any or all of the following
properties:

| Option         | Type       | Description                                                                                                                                                                                       | Required |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `index`        | `string`   | Which ES index to use when querying                                                                                                                                                               | x        |
| `type`         | `string`   | Which ES type to use when querying                                                                                                                                                                |          |
| `summaryView`  | `function` | Used by `results` to return a summary view instead of the whole document, (e.g. for indexes with many fields). Defaults to returning the `hit` property.                                          |          |
| `highlight`    | `object`   | Used by `results` to determine what fields to highlight, and whether or not they are `inline` (copied over inline on to the source) or `additional` (in a list of additional fields that matched) |          |
| `forceExclude` | `array`    | Used by `results` to extend the exclude fields provided on the search tree. The extension happens only if the results node has a `forceExclude` flag set to true.                                 |

You can read more about these here:

- [contexture-elasticsearch repository](https://github.com/smartprocure/contexture-elasticsearch).
- [Schemas section on our Querying docs](../querying/schemas.md).

4. Our Search Function

```javascript
let search = Contexture({
  schemas,
  providers: {
    elasticsearch: provider({
      getClient,
      request: {
        headers: {
          'custom-header-app-name': 'my-app-sent-this',
        },
      },
      types: types(),
    }),
  },
})
```

Once we have the schemas set, we can create our `search` function.
For this purpose, we will be calling `Contexture` with just one
object. This object will have the `schemas`, and the `providers`. The
providers will host just one key/value, the one specific for
`elasticsearch`. The provider, which we required at the beginning of
the script, needs to be called with the `getClient` function we just
created and the `types()` that we got from the
`contexture-elasticsearch/types` repository. We also show that you can
customize the request headers by providing an object that includes the
headers keys and values. This `search` function is ready to receive
search trees and write the results back!

You can read more about these topics in the following links:

- [Contexture Core's Default Export](../under-the-hood/contexture-core.md#default-export).
- [Contexture Providers in detail](under-the-hood/contexture-providers/README.md).

This example and many other important details about
`contexture-elasticsearch` are accessible in the following links:

- [contexture-elasticsearch repository](https://github.com/smartprocure/contexture-elasticsearch).

### Connecting to MongoDB

The followng code example shows how to connect to MongoDB:

```javascript
let Contexture = require('contexture')
let provider = require('contexture-mongo')
let types = require('contexture-mongo/types')
let MongoClient = require('mongodb').MongoClient

let schemas = {
  yourCustomSchemaName: {
    mongo: {
      collection: 'SomeCollection',
    },
  },
}

let search = null

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  search = Contexture({
    schemas,
    providers: {
      mongo: provider({
        getClient: () => client,
        types: types(),
      }),
    },
  })
})
```

The code above will provide a working search function `search` that
will transform any given query into a working MongoDB query,
which will be sent to the database to retrieve the data. Let's examine
this code in greater detail.

1. The Dependencies

```javascript
let Contexture = require('contexture')
let provider = require('contexture-mongo')
let types = require('contexture-mongo/types')
let MongoClient = require('mongodb').MongoClient
```

The first lines are about requiring dependencies, the first
dependency being just `contexture`. The second one is our database
provider, `contexture-mongo`. Then, we require the types; even
though you will probably have to write your own types, we have some
pre-defined types available at `contexture-mongo/types`.
Lastly, we require `mongodb` to get the much needed `MongoClient`, so
we can actually connect to the database.

Please feel free to dig around these topics by following these links:

- [Contexture Providers](under-the-hood/contexture-providers/README.md).
- [Types and Type Components](types/README.md).
- [MongoDB's NodeJS Package's API](http://mongodb.github.io/node-mongodb-native/3.0/api).

2. The Schemas

```javascript
let schemas = {
  yourCustomSchemaName: {
    mongo: {
      collection: 'SomeCollection',
    },
  },
}
```

As shown above, the next thing we do is to define the schemas. This is
an object which properties are the names of each one of the schemas
that will be available for the contexture DSL. The schemas for the
MongoDB provider can specify any or all of the following
properties:

| Option       | Type     | Description                                                 | Required |
| ------------ | -------- | ----------------------------------------------------------- | -------- |
| `collection` | `string` | The MongoDB collection that will be used to run the queries | x        |

You can read more about these here:

- [contexture-mongo repository](https://github.com/smartprocure/contexture-mongo).
- [Schemas section on our Querying docs](../querying/schemas.md).

3. The MongoDB Client & Our Search Function

```javascript
let search = null

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  search = Contexture({
    schemas,
    providers: {
      mongo: provider({
        getClient: () => client,
        types: types(),
      }),
    },
  })
})
```

Next we will need to connect to MongoDB. In the previous code, we
provide an example in which we connect to `mongodb://localhost:27017`,
and using a callback to the `connect` method, we are able to obtain
the database client that we need. Once we have this client, we can
actually create our `search` function. For this purpose, we will
be calling `Contexture` with just one object. This object will have
the `schemas`, and the `providers`. The providers will host just one
key/value, the one specific for `mongo`. The provider, which
we required at the beginning of the script, needs to be called with
a `getClient` function that will just return the database client, and
the `types()` that we got from the `contexture-mongo/types` repository.
With these steps completed, we end up with a function that is ready to
receive search trees and write the results back!

You can read more about these topics in the following links:

- [Contexture Core's Default Export](../under-the-hood/contexture-core.md#default-export).
- [Contexture Providers in detail](under-the-hood/contexture-providers/README.md).
- [Connecting to MongoDB using the native MongoDB driver for NodeJS](http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html#getting-that-connection-to-the-database).

This example and many other important details about
`contexture-mongo` are accessible in the following links:

- [contexture-mongo repository](https://github.com/smartprocure/contexture-mongo).
