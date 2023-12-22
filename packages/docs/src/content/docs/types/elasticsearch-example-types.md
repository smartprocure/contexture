---
title: Elasticsearch Example Types
---

Contexture is designed to target any database you might need. However,
so far we have only inplemented database providers for the only
databases that we use: ElasticSearch and Mongo.

Most of our types have relevant components already written to
facilitate building search interfaces. As we progress over each one of
these types, we will show small examples of simple components written
to search with these types. We hope to provide enough information to
allow you to take as little as you need, or as much as you want, and
fulfill you expectations.

Our ElasticSearch types are the following ones:

## Results Type

The `results` node is a node that if present, idicates to Contextre
that the queries and aggregations should finally run and retrieve all
the filtered values. It allows some customization properties, as
shown below:

| Property Name | Type   | Description                          |
| ------------- | ------ | ------------------------------------ |
| `page`        | Number | Current page of results.             |
| `pageSize`    | Number | Total results per page.              |
| `sortField`   | String | Field used to sort the results.      |
| `sortDir`     | String | Direction of sorting (`asc`, `desc`) |

## Bool Type

The bool type is intended to work as an ElasticSearch terms
aggregation with only one value for a single property. This is useful
for user interfaces with a checkbox to include or exclude a specific
field from a search (or a specific field-value pair).

Here is the list of all properties this type uses:

| Property Name | Type   | Description                                                          |
| ------------- | ------ | -------------------------------------------------------------------- |
| field         | String | Name of the field that we will be using to filter the search search. |
| value         | String | Value of the field that will be used to filter the search.           |

Example input:

```javascript
{
  type: 'bool',
  field: 'fieldName',
  value: true
}
```

Example output:

```javascript
{
  term: {
    fieldName: true
  }
}
```

You can read more about it in:

- [Source code of the type: bool](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/bool.js).
- [Unit tests of the type: bool](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/bool.js).
- Elastic Search [Term Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html).

## Cardinality Type

The Cardinality type serves to calculate an approximate count of the
distinct available values. This type only uses one property, `field`.
It returns it's values in the `context` of the node, rather than in
the `results` node.

Example input:

```javascript
{
  type: 'cardinality',
  field: 'Organization.Name.untouched'
}
```

Example output:

```javascript
{
  aggs: {
    cardinality: {
      cardinality: {
        field: 'Organization.Name.untouched'
      }
    }
  }
}
```

You can read more about it in:

- [Source code of the type: cardinality](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/cardinality.js).
- [Unit tests of the type: cardinality](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/cardinality.js).
- Elastic Search [Cardinality Aggregation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-cardinality-aggregation.html).

## Date Type

The Date type is used to specify a range of dates that will be used to
filter the available results. This range of dates can be specified by
a string formatted date (`YYYY-MM-DD`) or by a small set of possible
humanly readable date ranges. Details follow:

| Property Name | Type    | Description                                                                                                                                                                                                                                                                                     |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`        | String  | Either a date formatted as `YYYY-MM-DD`, or an ES date (formatted properly for ElasticSearch), or one of the following values: `thisQuarter` (for the current quarter of the year), `lastQuarter` (for the previously completed quarter of the year), `nextQuarter` (for the upcoming quarter). |
| `to`          | String  | Optional. Defaults to the current date. Only concidered if there's a `from` value, should be a date formatted as `YYYY-MM-DD` or an ES date (formatted properly for ElasticSearch).                                                                                                             |
| `useDateMath` | Boolean | Defines if we should parse `from` as one of the `*Quarter` dates.                                                                                                                                                                                                                               |
| `isDateTime`  | Boolean | Ignores any processing or formatting and accpets the `form` and `to` values as they come.                                                                                                                                                                                                       |

Example input 1:

```javascript
{
  type: 'date',
  field: 'fieldName',
  from: '2016-04-25'
}
```

Example output 1:

```javascript
{
  range: {
    fieldName: {
      gte: '2016-04-25',
      format: 'dateOptionalTime'
    }
  }
}
```

Example input 2:

```javascript
{
  type: 'date',
  field: 'fieldName',
  from: 'thisQuarter',
  useDateMath: true,
}
```

Example output 2:

```javascript
{
  range: {
    fieldName: {
      gte: moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD'),
      lte: moment.utc(datemath.parse(`${moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD')}||+3M-1d/d`)).format('YYYY-MM-DD'),
      format: 'dateOptionalTime'
    }
  }
}
```

You can read more about it in:

- [Source code of the type: date](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/date.js).
- [Unit tests of the type: date](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/date.js).
- Elastic Search [Range QUery](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html).

## Date Histogram Type

The `dateHistogram` type is very useful for retrieving the number of
results within specific periods of time. The idea here is to end up
building a chart showing how records have changed over time, for
example by it's creation date or some other date property. This type
is able to do this by running a nested stats aggregation inside a
dateHistogram aggregation, while also supporting for tweaking min/max
bounds.

This type returns it's values in the `context` of the node, rather
than in the `results` node.

| Property Name             | Type           | Description                                                                                                                                                                                      |
| ------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key_field`               | String         | What might be considered a good candidate for the X axis of the chart.                                                                                                                           |
| `value_field`             | String         | What might be considered a good candidate for the Y axis of the chart.                                                                                                                           |
| `interval`                |                | String                                                                                                                                                                                           | Available expressions for interval: `year` (`1y`), `quarter` (`1q`), `month` (`1M`), `week` (`1w`), `day` (`1d`), `hour` (`1h`), `minute` (`1m`), `second` (`1s`). |
| `boundsRange_min`         | Date or String | Lower date limit that will be considered to filter the possible results.                                                                                                                         |
| `boundsRange_max`         | Date or String | Upper date limit that will be considered to filter the possible results.                                                                                                                         |
| `boundsRange_useDateMath` | Boolean        | If set to `true`, the min and max ranges will be valid as strings representative of dates, and will be formatted by NPM's library [`@elastic/datemath`](https://github.com/elastic/datemath-js). |

Example input:

```javascript
{
  type: 'dateHistogram',
  key_field: 'PO.IssuedDate',
  value_field: 'LineItem.TotalPrice'
}
```

Example output:

```javascript
{
  aggs: {
    max_date: {
      max: {
        field: 'PO.IssuedDate',
      },
    },
    min_date: {
      min: {
        field: 'PO.IssuedDate',
      },
    },
    twoLevelAgg: {
      date_histogram: {
        field: 'PO.IssuedDate',
        interval: 'year',
        min_doc_count: 0,
      },
      aggs: {
        twoLevelAgg: {
          stats: {
            field: 'LineItem.TotalPrice',
          },
        },
      },
    },
  },
}
```

You can read more about it in:

- [Source code of the type: dateHistogram](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/dateHistogram.js).
- [Unit tests of the type: dateHistogram](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/dateHistogram.js).
- [Two Level Aggregations in ElasticSearch](https://www.elastic.co/blog/intro-to-aggregations-pt-2-sub-aggregations).
- [Date Histogram Aggregation in ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html).

## Exists Type

The `exists` type is used to check wether some property exsits or not.
It requires only two fields: `field` and `value`.

| Property Name | Type    | Description                                         |
| ------------- | ------- | --------------------------------------------------- |
| `field`       | String  | The target field we want to check.                  |
| `value`       | Boolean | the value we want to check. Normally true or false. |

Example input:

```javascript
{
  type: 'exists',
  field: 'fieldName',
  value: true
}
```

Example output:

```javascript
{
  exists: {
    field: 'fieldName'
  }
}
```

You can read more about it in:

- [Source code of the type: exists](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/exists.js).
- [Unit tests of the type: exists](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/exists.js).
- Elastic Search [Exists Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html).

## Facet Type

The `facet` type represents a list of dynamic choices, e.g. a checkbox
list filter. We achieve this by running an ElasticSearch terms
aggregation. We provide a way to limit the number of results that you
will receive with the `size` property, so that large queries can
safely be used. For that same purpose, the property `optionsFilter` is
given, so that search queries can filter the results with a string.

Facet returns it's values in the `context` of the node, rather than in
the `results` node.

| Property        | Type                                         | Default          | Description                                                                                                                       |
| --------------- | -------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `field`         | String                                       | None, _required_ | The field it's operating on.                                                                                                      |
| `mode`          | String (`include` or `exclude`)              | `include`        | Wether this filter acts as for the inclusion or exclusion of the selected values when picking up what results to keep.            |
| `values`        | Array (of strings)                           | `[]`             | Already selected values.                                                                                                          |
| `fieldMode`     | String (`autocomplete`, `word` or `suggest`) | `autocomplete`   | Whether to look at the entire field (`autocomplete`), the analyzed words in the field (`word`), or magic suggestions (`suggest`). |
| `size`          | Number                                       | 12               | How many options to return.                                                                                                       |
| `cardinality`   | Number                                       | 5000             | Precision threshold override.                                                                                                     |
| `includeZeroes` | Boolean                                      | false            | If true, it will include options with 0 matching documents (aka `min_doc_count: 0`)                                               |
| `optionsFilter` | String                                       | ''               | Filters the options further, e.g. a find box above a checkbox list                                                                |
| `caseSensitive` | Boolean                                      | false            | Whether options filter is case sensitive.                                                                                         |
| `sort`          | String (`term` or `count`)                   | `count`          | Sort results alphabetically or by count of matching records.                                                                      |

Example input 1:

```javascript
{
  type: 'facet',
  field: 'fieldName',
  values: ['abc', '123']
}
```

Example output 1:

```javascript
{
  terms: {
    'fieldName.untouched': ['abc', '123']
  }
}
```

Example input with exclude:

```javascript
{
  type: 'facet',
  field: 'fieldName',
  mode: 'exclude',
  values: ['abc', '123'],
}
```

Example output with exclude:

```javascript
{
  bool: {
    must_not: {
      terms: {
        'fieldName.untouched': ['abc', '123'],
      },
    },
  },
}
```

You can read more about it in:

- [Source code of the type: facet](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/facet.js).
- [Unit tests of the type: facet](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/facet.js).
- Elastic Search [Terms Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html).

## Geo Type

The `geo` type represents a geographic radius search. It needs a
geocodeLocation service passed in to it. We currently assume that you
will be using a google maps geocoder search.

| Property Name | Type                                     | Description                                                                               |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| `field`       | String (required)                        | The field it's operating on                                                               |
| `location`    | String (required)                        | Location to geocode (e.g. an address, businessname, anything the google geocode can take) |
| `radius`      | Number (required)                        | Radius in miles                                                                           |
| `operator`    | String (either `within` or `not within`) | Whether the filter forces inclusion or exclusion (defaults with `within`).                |

Example input:

```javascript
{
  type: 'geo',
  field: 'fieldName',
  location: 'SmartProcure',
  radius: 10,
  operator: 'within',
}
```

Example output:

```javascript
{
  geo_distance: {
    fieldName: '26.3170479,-80.1131784',
    distance: '10mi',
  },
}
```

You can read more about it in:

- [Source code of the type: geo](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/geo.js).
- [Unit tests of the type: geo](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/geo.js).
- [ElasticSearch's Geo Distance Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html).

## Number Type

Number represents a number range with inclusive bounds. This type
provides the ability to determine the best range values based on
percentile interval and range threshold.

| Property Name | Type   | Description                                       |
| ------------- | ------ | ------------------------------------------------- |
| `field`       | String | The field we will be using to filter the results. |
| `min`         | Number | Lower boundary of the filter.                     |
| `max`         | Number | Upper boundary of the filter.                     |

Some Notes:

1. An empty value as the upper boundary represents infinity.
2. An empty value as the lower boundary represents negative infinity.
3. Zero has to be respected as a boundary value.
4. If findBestRange is true it will return the best min and max range.

Example input:

```javascript
{
  type: 'number',
  field: 'fieldName',
  min: 500,
  max: 1000,
}
```

Example output:

```javascript
{
  range: {
    fieldName: {
      gte: 500,
      lte: 1000,
    },
  },
}
```

You can read more about it in:

- [Source code of the type: number](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/number.js).
- [Unit tests of the type: number](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/number.js).

## Number Range Histogram Type

The type `numberRangeHistogram` represents a number range with inclusive bounds. This type
returns feedback in the form of histogram and statistical data.
This type returns it's values in the `context` of the node, rather
than in the `results` node.

| Property Name        | Type   | Description                                                                                                                                                        |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `field`              | String | The field we will be using to filter the results.                                                                                                                  |
| `min`                | Number | Lower boundary of the filter.                                                                                                                                      |
| `max`                | Number | Upper boundary of the filter.                                                                                                                                      |
| `percentileInterval` | Number | Used to group the results based on how many of the records are within each one of the sections given by the interval, from the `min` value, up to the `max` value. |

Some Notes:

1. An empty value as the upper boundary represents infinity.
2. An empty value as the lower boundary represents negative infinity.
3. Zero has to be respected as a boundary value.

- [Source code of the type: numberRangeHistogram](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/numberRangeHistohgram.js).
- [Histogram Aggregation in ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/6.1/search-aggregations-bucket-histogram-aggregation.html).

## Query Type

Query represents a raw elasticsearch query_string. It's mostly used to
provide a simple sarch box on the user interface.

| Property Name | Type    | Description                                                                                                                                                                |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`       | String  | The field we will be using to filter the results.                                                                                                                          |
| `query`       | String  | String that will be used to match the resulting records, based on the values available for the specified field on each one of the records.                                 |
| `exact`       | Boolean | Wether to match the query text as-is, or to try to be more flexible with the matches (accepting values if they contain the given query, even if the casing doesn't match). |

Example input:

```js
{
  type: 'query',
  field: 'fieldName',
  query: 'cable',
  exact: true,
}
```

Example output:

```js
{
  query_string: {
    query: 'cable',
    default_operator: 'AND',
    default_field: 'fieldName.exact',
    analyzer: 'exact',
  },
}
```

You can read more about it in:

- [Source code of the type: query](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/query.js).
- [Unit tests of the type: query](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/query.js).

## Text Type

Text implements raw text analysis like starts with, ends with, etc.
These are generally regex queries.

| Property Name | Type   | Description                                                                                          |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `field`       | String | The field we will be using to filter the results.                                                    |
| `join`        | String | Either `any`, `all` or `none`.                                                                       |
| `operator`    | String | `containsWord`, `startsWith`, `wordStartsWith`, `endsWith`, `wordEndsWith`, `is` or `containsExact`. |
| `values`      | Array  | Array containing all the words that want to be used as inputs.                                       |

Example input:

```js
{
  type: 'text',
  field: 'fieldName',
  join: 'any',
  operator: 'contains',
  values: ['laserjet', 'printer'],
}
```

Example output:

```js
{
  query_string: {
    default_field: 'fieldName',
    default_operator: 'OR',
    query: '"laserjet" "printer"',
  },
}
```

You can read more about it in:

- [Source code of the type: text](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/text.js).
- [Unit tests of the type: text](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/text.js).

## Other ElasticSearch Example Types

For more informaion about other available example types, please check:
<https://github.com/smartprocure/contexture-elasticsearch>
