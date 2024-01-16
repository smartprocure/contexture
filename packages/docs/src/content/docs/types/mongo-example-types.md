---
title: Mongo Example Types
---

Most of our types have relevant components already written to
facilitate building search interfaces. As we progress over each one of
these types, we will show small examples of simple components written
to search with these types. We hope to provide enough information to
allow you to take as little as you need, or as much as you want, and
fulfill you expectations.

Our MongoDb types are the following ones:

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

Example input:

```javascript
{
  type: 'date',
  field: 'fieldName',
  from: '2016-04-25'
}
```

Example output:

```javascript
{
  fieldName: {
    $gte: new Date('2016-04-25'),
  },
}
```

You can read more about it in:

- [Source code of the type: date](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/date.js).
- [Unit tests of the type: date](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/date.js).
- MongoDb's [$gte](https://docs.mongodb.com/manual/reference/operator/query/gte/).
- MongoDb's [$lte](https://docs.mongodb.com/manual/reference/operator/query/lte/).

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
  $and: [
    {
      fieldName: {
        $exists: true,
        $ne: '',
      },
    },
    {
      fieldName: {
        $ne: null,
      },
    },
  ],
}
```

You can read more about it in:

- [Source code of the type: exists](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/exists.js).
- [Unit tests of the type: exists](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/exists.js).
- MongoDb's [$exists](https://docs.mongodb.com/manual/reference/operator/query/exists/).

## Facet Type

The `facet` type represents a list of dynamic choices, e.g. a checkbox
list filter. We achieve this by running an ElasticSearch terms
aggregation. We provide a way to limit the number of results that you
will receive with the `size` property, so that large queries can
safely be used. For that same purpose, the property `optionsFilter` is
given, so that search queries can filter the results with a string.

Facet returns it's values in the `context` of the node, rather than in
the `results` node.

| Property | Type                            | Default          | Description                                                                                                            |
| -------- | ------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `field`  | String                          | None, _required_ | The field it's operating on.                                                                                           |
| `mode`   | String (`include` or `exclude`) | `include`        | Wether this filter acts as for the inclusion or exclusion of the selected values when picking up what results to keep. |
| `values` | Array (of strings)              | `[]`             | Already selected values.                                                                                               |
| `size`   | Number                          | 10               | How many options to return.                                                                                            |

Example input:

```javascript
{
  type: 'facet',
  field: 'fieldName',
  values: ['abc', '123']
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

You can read more about it in:

- [Source code of the type: facet](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/facet.js).

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
  fieldName: {
    $gte: 500,
    $lte: 1000
  }
}
```

You can read more about it in:

- [Source code of the type: number](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/number.js).
- [Unit tests of the type: number](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/number.js).
- MongoDb's [$gte](https://docs.mongodb.com/manual/reference/operator/query/gte/).
- MongoDb's [$lte](https://docs.mongodb.com/manual/reference/operator/query/lte/).

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
  $or: [
    {
      fieldName: {
        $regex: 'laserjet',
        $options: 'i',
      },
    },
    {
      fieldName: {
        $regex: 'printer',
        $options: 'i',
      },
    },
  ]
}
```

You can read more about it in:

- [Source code of the type: text](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/text.js).
- [Unit tests of the type: text](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/text.js).

## Other MongoDb Example Types

For more informaion about other available example types, please check:
<https://github.com/smartprocure/contexture-mongo>
