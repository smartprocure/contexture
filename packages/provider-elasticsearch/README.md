# contexture-elasticsearch
Elasticsearch Provider for Contexture

## Usage
This provider takes a config object as a parameter, and expects a `getClient` method to be provided, which should be an instantiated elasticsearch client.

### Provider
This provider takes a config object as a parameter:

| Option          | Type       | Description                                      | Required |
| --------------- | ---------- | -----------                                      | -------- |
| `getClient`     | `function` | Returns an instantiated elasticsearch client     | x        |
| `searchWrapper` | `function` | Higher order function for search caching         |          |
| `types`         | `object`   | Contexture node types, like all other providers  |          |

### Schemas
Schemas with with an elasticsearch provider can specify any or all of the following properties:

| Option         | Type       | Description                          | Required |
| ------         | ----       | -----------                          | -------- |
| `index`        | `string`   | Which ES index to use when querying  | x        |
| `highlight`    | `object`   | Used by `results` to determine what fields to highlight, and whether or not they are `inline` (copied over inline on to the source) or `additional` (in a list of additional fields that matched) | |

### Example Schema for SomeType in SomeIndex

```js
module.exports = {
  elasticsearch: {
    index: 'SomeIndex'
  }
}
```

### Seting up contexture
```js
let _ = require('lodash/fp')
let Contexture = require('contexture')
let provider = require('contexture-elasticsearch')
let types = require('contexture-elasticsearch/types')
let schemas = require('./path/to/schemas')
let elasticsearch = require('elasticsearch')
let AgentKeepAlive  = require('agentkeepalive')

// Setup
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

// Simple usage (tree would come from the client)
process(tree)

// Usage with custom headers applied to every elasticsearch request (tree would come from the client)
process(tree, {
  requestOptions: {
    headers: {
      'custom-header-app-name': 'my-app-sent-this'
    }
  },  
})
```

## Automatic Schema Detection
As of 0.10.0, a `getSchemas` async method is exposed on an instantiated provider, which will read the elasticsearch mappings and aliases to automatically generate schemas.

Generated schemas also include field definitions, which can leveraged with something like `exampleTypeSchemaMapping` to make them fit for consumption by dynamic field pickers such as the one in contexture-react.

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
| `size`          | number                          | 12                | How many options to return |
| `includeZeroes` | boolean                         | false             | If true, it will include options with 0 matching documents (aka `min_doc_count: 0`) |
| `optionsFilter` | string                          | ''                | Filters the options further, e.g. a find box above a checkbox list |
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
Represents a geographic radius search. Requires geocoding on the client before passing up.

Input

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `field`         | string                          | None, *required*  | The field it's operating on |
| `latitude`      | number/string                   | None, *required*  | Latitude |
| `longitude`     | number/string                   | None, *required*  | Longitude |
| `radius`        | number                          | None, *required*  | Radius in miles |
| `operator`      | `within`/`not within`           | within            | Whether the filter forces inclusion or exclusion |

#### `dateRangeFacet`
dateRangeFacet is like a `facet` but the options correspond to named date range buckets

Input

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `field`         | string                          | None, *required*  | The field it's operating on |
| `ranges`        | array[{ range: NamedDateRange, key: string}]                   | None, *required*                | Ranges should have 'range' prop containing the range phrase (eg. 'allFutureDates') and a key to represent the value |
| `values`        | array[string]                   | []                | What is checked |
| `timezone`        | string                   | 'UTC'                | What timezone to use |


Output

```js
{
  options: [{
    name: String,
    count: Number
  }]
}
```


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
  range: String, // Choice of an explicit hard coded date range option:
    // allDates | exact | last3Days | last7Days | last30Days | last90Days | last180Days | last12Months | last15Months | last18Months | last24Months | last36Months | last48Months | last60Months | lastCalendarMonth | lastCalendarYear | thisCalendarMonth | thisCalendarYear | nextCalendarMonth | nextCalendarYear | next30Days | next60Days | next90Days | next6Months | next12Months | next24Months | next36Months | allPastDates | allFutureDates
  from: DateString, // Date string - *No longer supports date math*, requires range to be `exact`
  to: DateString,
  isDateTime: Boolean // If true, it will pass the from and to values as is, without formatting assuming it is valid date & time ES string
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
Number represents a number range with inclusive bounds. This type provides the ability to determine the best range values based on percentile interval and range threshold.

Some Notes:
1. An empty value as the upper boundary represents infinity.
2. An empty value as the lower boundary represents negative infinity.
3. Zero has to be respected as a boundary value.
4. If findBestRange is true it will return the best min and max range.

Request:

```js
{
  field: String,
  min: Number,
  max: Number,
  percentileInterval: Number,
  rangeThreshold: Number,
  findBestRange = Boolean
}
```

Response:

```js
{
  statistical: {
    count: Number,
    min: Number,
    max: Number,
    avg: Number,
    sum: Number
  },
  percentiles: {
    rangeMin: Number,
    rangeMax: Number,
    intervalMin: Number,
    intervalMax: Number
  },
  bestRange: {
    min: Number,
    max: Number
  }
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

#### `tagsQuery`
Tags represents one or more search terms.
```js
{
  field: String,
  tags: [
          {
            word: String, // Search term
            misspellings: Boolean (optional), // Valid for single word search term
            isPhrase: Boolean (optional), // Valid for multi-word search term
            distance: Number (optional) // Valid for multi-word search term
          }
        ], // One or more objects
  join: 'any|all|none', // One of these options
  exact: Boolean // Represents opting out of stemming. Currently assumes the presence of an `.exact` subfield and analyzer. Defaults to false.
}
```

#### `text`
Text implements raw text analysis like starts with, ends with, etc. These are generally regex queries.



### Result-Only Types
These types don't do any filtering of their own and only have results. These often power charts or analytics pages.

#### `results`
Search result "hits", with support for highlighting, paging, sorting, etc.

#### `xGroupStats`
We have a few new nodes of the form xGroupStats, where `x` is a grouping (bucketing) type. They all share a similar API:

**Documentation here is still deeply WIP.**

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `groupField`         | string                          | None, *required*  | The field to group by |
| `statField`         | string                          | None  | The field to calculate stats for |
| `stats`        | [string]                   | ['sum', 'min', 'max', 'sum']                | Which stats to include, can be avg, min, max, sum, or any of the other metrics supported by elasticsearch. |

Here's a kitchen example, with sections for the various types along with explanations for the more mongo focused developer:
```js
let example = { 
  // terms_stats
  type: 'fieldValuesGroupStats', //terms -> { $group: {_id: groupField}}
  size: 10,
  filter: 'asdf',
  sort: {
    field: 'sum|min|max|avg|count|term',
    order: 'asc|desc',
  },
  // When multilevel sorting is supported:
  // sort: [{
  //   field: 'sum|min|max|avg|count|term',
  //   dir: 'asc|desc',
  // }],

  
  // smartIntervalHistogram
  type: 'numberIntervalGroupStats', // {$bucket }
  groupField: 'price',
  interval: 500,// 'smart'|Number,
  
  
  // dateHistogram
  type: 'dateIntervalGroupStats', /// {$group based on date propeties} interval: month {}
  interval: 'year', // auto uses autoDateHistogram
  

  // rangeStats
  type: 'numberRangesGroupStats', ///{$cond + $group}
  groupField: 'price',
  ranges: [{from: 0, to: 500}, {from: 501, to:1000}],
  

  // missing? date range facet?
  type: 'dateRangesGroupStats', // {$cond + group} from ranges [from: 1980 to 1992, from1992 to 2000]
  ranges: [{ from, to }],
  

  // matchStats/matchCardinality
  // local v national quote awards
  type: 'fieldValuePartitionGroupStats', /// {$cond + group} OR $facet
  groupField: 'CompanyState',
  matches: 'FL',
  
  
  // percentileRange
  type: 'percentilesGroupStats',


  statsField: 'awardAmount',
  stats: ['count|min|max|sum|avg|cardinality'],// |percentiles|percentileRanks|hits??????
  /// hits: size+include? maybe hitsSize+hitsInclude or hits:{size,include}

}
```

All of these types share a similar output structure. Results are on a context property called `results` with stat aggs flattened on as properties of each result (bucket)

### Deprecated

#### `cardinality`
**Use `stats` with `stats: ['cardinality']` instead**
A cardinality aggregation. Returns the cardinality of a field.

Input

| Name            | Type                            | Default           | Description |
| ----            | ----                            | -------           | ----------- |
| `field`         | string                          | None, *required*  | The field it's operating on |

Output

```
{
  cardinality: {
    cardinality: {
      field: String,
    },
  },
}
```

#### `dateHistogram`
**Use `dateIntervalGroupStats` instead**
A nested stats aggregation inside a dateHistogram aggregation.

#### `groupedMetric`
**Use `??????` instead**
A more general version of esTwoLevelAggregation, used in analysis builders/pivot tables. It takes config for an array of buckets and a metric agg. The buckets are nested with the metric on the inside.

#### `matchStats`
**Use `fieldValuePartitionGroupStats` instead**
A filters bucket which puts results into a pass and fail bucket, along with a stats metric nested inside.

#### `rangeStats`
**Use `numberRangesGroupStats` instead**
A stats aggregation in a range aggregation.

#### `smartIntervalHistogram`
**Use `numberIntervalGroupStats` instead**
A stats aggregation inside a histogram aggreation - divided into intelligent chunks based on the min and max and snapping to clean "smart" business friendly intervals (roughly 25% of powers of 10).

#### `statistical`
**Use `stats` instead**
A stats aggregation.

#### `terms_stats`
**Use `fieldValuesGroupStats` instead**

