# contexture-elasticsearch
Elasticsearch Provider for Contexture

## Usage
This provider takes a config object as a parameter, and expects a `getClient` method to be provided, which should be an instantiated elasticsearch client.

### Provider
This provider takes a config object as a parameter:

| Option      | Type       | Description                                      | Required |
| ------      | ----       | -----------                                      | -------- |
| `getClient` | `function` | Returns an instantiated elasticsearch client     | x        |
| `request`   | `object`   | Merged in the json body of every request to elasticsearch (e.g. to add custom headers) |          |
| `types`     | `object`   | Contexture node types, like all other providers  |          |

90, 145, 82

### Schemas
Schemas with with an elasticsearch provider can specify any or all of the following properties:

| Option        | Type       | Description                          | Required |
| ------        | ----       | -----------                          | -------- |
| `index`       | `string`   | Which ES index to use when querying  | x        |
| `type`        | `string`   | Which ES type to use when querying   |          |
| `summaryView` | `function` | Used by `results` to return a summary view instead of the whole document, (e.g. for indexes with many fields). Defaults to returning the `hit` property. | |
| `highlight`   | `object `  | Used by `results` to determine what fields to highlight, and whether or not they are `inline` (copied over inline on to the source) or `additional` (in a list of additional fields that matched) | |

### Example Schema for SomeType in SomeIndex

```js
module.exports = {
  elasticsearch: {
    index: 'SomeIndex',
    type: 'SomeType'
  }
}
```

### Seting up contexture
```js
let _ = require('lodash')
let Contexture = require('contexture')
let provider = require('contexture-elasticsearch')
let types = require('contexture-elasticsearch/types')
let schemas = require('./path/to/schemas')
let elasticsearch = require('elasticsearch')
let AgentKeepAlive  = require('agentkeepalive'),

let process = Contexture({
  schemas,
  providers: {
    elasticsearch: provider({
      getClient: _.memoize(() =>
        elasticsearch.Client({
          // This is an example config, see the elasticsearch js docs for more
          minSockets: 1,
          maxSockets: 20,
          keepAlive: true,
          createNodeAgent: (connection, config) =>
            new AgentKeepAlive(connection.makeAgentConfig(config))
        })
      ),
      request: {
        headers: {
          'custom-header-app-name': 'my-app-sent-this'
        }
      },
      types: types({
        geo: {
          geocodeLocation: query =>
            googleplaces.textSearch({
              query
            })
        }
      })
    })
  }
})
```