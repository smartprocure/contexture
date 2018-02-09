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

## Default Types

### Combo Filter + Result Types
These types both filter and have contextual results.

#### `facet`
Facet represents a list of dynamic choices, e.g. a checkbox list filter.

Input

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `field`         | string                          | None, *required*  | The field it's operating on |
| `mode`          | `include`/`exclude`             | include           | Should this filter act as inclusion or exclusion of the values |
| `values`        | array[string]                   | []                | What is checked |
| `fieldMode`     | `autocomplete`/`word`/`suggest` | autocomplete      | Whether to look at the entire field (autocomplete), the analyzed words in the field, or magic suggestions. This generally means switching field/analyzers but abstracts that lower level es/index knowledge away from the client. |
| `size`          | number                          | 12                | How many options to return |
| `cardinality`   | number                          | 5000              | Precision threshold override |
| `includeZeroes` | boolean                         | false             | If true, it will include options with 0 matching documents (aka `min_doc_count: 0`) |
| `optionsFilter` | string                          | ''                | Filters the options further, e.g. a find box above a checkbox list |
| `caseSensitive` | boolean                         | false             | Whether options filter is case sensitive. *no known usages* |
| `sort`          | `term`/`count`                  | count             | Sort results alphabetically or by count of matching records |


Output

```js
{
  cardinality: Number, // Cardinality (total number of options) for the field
  options: [{
    name: String,
    count: Number
  }]
}
```

#### `geo`
Represents a geographic radius search. Needs a geocodeLocation service passed in to it. Currently assumes it is a google maps geocoder search.

Input

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `field`         | string                          | None, *required*  | The field it's operating on |
| `location`      | string                          | None, *required*  | Location to geocode (e.g. an address, businessname, anything the google geocode can take) |
| `radius`        | number                          | None, *required*  | Radius in miles |
| `operator`      | `within`/`not within`           | within            | Whether the filter forces inclusion or exclusion |

Output

```js
{
  place: GeocodeLocationResponse
}
```

The result can be used to show what location the server on a map, though in practice it's usually better to geocode on the client. This type is planned to be extended to support passing along raw lat/lng.


### Filter Only Types
Filter only types just filter and nothing more. They don't have contextual results of their own.


#### `bool`
Bool represent a boolean check, e.g. a checkbox for true/false

```js
{
  field: String,
  value: String|Boolean
}
```

#### `date`
Date represents a data range filter, with support datemath

```js
{
  field: String,
  from: DateString|'thisQuarter|lastQuarter|nextQuarter', // Date string or one of three custom date math options
  to: DateString,
  useDateMath: Boolean // If true, it will parse dates as dateMath using @elastic/datemath
}
```

#### `exists`
Exists represents whether or not a field is present on results

```js
{
  field: String,
  value: Boolean // Whether the field should exist or not
}
```

#### `number`
Number represents a number range with inclusive bounds. This type is planned to be extended to return contextual info on min, max, and histogram value distribution.

Some Notes:
1. An empty value as the upper boundary represents infinity.
2. An empty value as the lower boundary represents negative infinity.
3. Zero has to be respected as a boundary value.

```js
{
  field: String,
  min: Number,
  max: Number
}
```

#### `query`
Query represents a raw elasticsearch query_string.
```js
{
  field: String,
  query: String, // The actual query
  exact: Boolean // Represents opting out of stemming. Currently assumes the presence of an `.exact` subfield and analyzer. Defaults to false.
}
```

#### `text`



### Result-Only Types
These types don't do any filtering of their own and only have results. These often power charts or analytics pages.

#### `cardinality`
#### `dateHistogram`
#### `esTwoLevelAggregation`
#### `groupedMetric`
#### `matchCardinality`
#### `matchStats`
#### `nLevelAggregation`
#### `nonzeroClusters`
#### `percentileRanks`
#### `percentiles`
#### `percentilesRange`
#### `rangeStats`
#### `results`
#### `smartIntervalHistogram`
#### `smartPercentileRanks`
#### `statistical`
#### `terms`
#### `termsDelta`
#### `termsStatsHits`
This result type combines multiple ES aggregations (terms/stats/top_hits) to create a result set.
On top of this the result set also allows for `details` configuration where a summary/details type of results can be achived.

**Configuration:**

```js
config: {
    key_field: '<keyField>',
    value_field: '<valueField>',
    details_key_field: '<detailsKeyField>',       // Optional
    details_value_field: '<detailsValueField>',   // Optional
    size: 500,          // The total result size
    hitSize: 50,        // The hit result size
    details_size: 500,  // The details result size
    order: 'sum',
    sortDir: 'desc',
    include: ['<field1>', '<field2>'],  // // Optional. Which fields to include in the summary.
    details_include: ['<fieldToIncludeInDetails>']  // Optional. Which detail fields to include in the details section
}
```
  **Example:**

```js
{
  key: 'City of Deerfield',
  doc_count: 50,
  count: 6,
  min: 60,
  max: 98,
  avg: 78.5,
  sum: 471,
  hits: [
    {
      Organization: {
        LatLong: '34.056237,-118.257362',
      },
    },
  ],
  details: [
    {
      Organization: {
        ID: '80229',
      },
      doc_count: 1,
      key: 'University Of Michigan at Ann Arbor, MI',
    },
  ],
}
```
}

#### `terms_stats`
#### `twoLevelMatch`

