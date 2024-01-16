---
title: React Components
---

A huge part of working with advanced search interfaces is identifying
how to portray a specific search filter that you might want to use.
We've talked about very simple components that react to changes on the
tree state, but now we'll see how to make it easier for more complex
nodes to gather the inputs necessary, and also to show the results
correctly. Here we'll see components specifically crafted for some of
our providers' example types.

**Notes:**

- Keep in mind that the theme on these components is purely
  optional. Later on we'll see how to [theme our
  components](../theming/README.md).
- Please be aware that when we refer to `Component`, we mean a
  Function that returns a valid JSX Element. You can read more here:
  [Components and
  Props, on the ReactJS docs](https://reactjs.org/docs/components-and-props.html).

## Query

![Query Type Screenshot](https://i.imgur.com/8r2X9MI.png)

The Query component is probably the most commonly needed for search
interfaces. It's an input field that allows you to filter results if
the text matches part of the value of a specfic property on any of the
records.

Here's how you write a node of type `query` in your _searchTree_:

```javascript
{
  key: 'searchQuery',
  type: 'query',
  field: 'title',
  query: ''
}
```

Here is the list of properties that this component expects to have on the node:

| Property Name | Type   | Required | Description                                           |
| ------------- | ------ | -------- | ----------------------------------------------------- |
| `query`       | String | No       | Search query that should be visible in the component. |

**Note:** The properties present in the search tree that aren't used by the node
might be needed for the Provider's type. See the Provider type's
documentation in our [previous pages](README.md).

Here's how you write your component:

```javascript
let Query = require('contexture-react/dist/exampleTypes').Query
// ...
// Later, on your render function, or where you put your components:
<Query path={['query']} tree={searchTree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type      | Default Value | Description                                                                                                                     |
| ------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `TextInput`   | Component | `input`       | Text input component. Useful for any style customization, and for libraries that (for example) wrap Bootstrap and it's classes. |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the query type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/query.js).
- [(ElasticSearch Provider) Unit tests of the query type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/query.js).
- [(MongoDb Provider) Source code of the query type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/query.js).
- [(MongoDb Provider) Unit tests of the query type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/query.js).
- [Source code of the Query component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/Query.js).

## Date

![Date Type Screenshot 1](https://i.imgur.com/XwuGi2c.png)
![Date Type Screenshot 2](https://i.imgur.com/joTECy0.png)

_(Same goes with the right, not adding another screenshot to avoid
consuming more space.)_

The Date component helps by allowing users to filter the data to
obtain results within a specific range of dates. It consists of only
two date pickers. Here's how you write a node of type `date` in your
_searchTree_:

```javascript
{
  type: 'date',
  field: 'fieldName',
  from: '2016-04-25',
  to: '2017-05-26'
}
```

Here is the list of properties that this component expects to have on the node:

| Property Name | Type                                 | Required | Description                        |
| ------------- | ------------------------------------ | -------- | ---------------------------------- |
| `from`        | Date or String (`YYYY-MM-DD` format) | Yes      | The initial date of our timeframe. |
| `to`          | Date or String (`YYYY-MM-DD` format) | No       | The final date of our timeframe.   |

**Note:** The properties present in the search tree that aren't used by the node
might be needed for the Provider's type. See the Provider type's
documentation in our [previous pages](README.md).

Here's how you write your component:

```javascript
let DateComponent = require('contexture-react/dist/exampleTypes').Date
// ...
// Later, on your render function, or where you put your components:
<DateComponent path={['date']} tree={searchTree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type      | Default Value                       | Description                                                                                        |
| ------------- | --------- | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `DateInput`   | Component | `x => <input type="date" {...x} />` | The component that wraps each one of the inputs where the dates end up written by the date-picker. |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the date type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/date.js).
- [(ElasticSearch Provider) Unit tests of the date type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/date.js).
- [(MongoDb Provider) Source code of the date type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/date.js).
- [(MongoDb Provider) Unit tests of the date type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/date.js).
- [Source code of the Date component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/Date.js).

## DateHistogram

![DateHistogram Screenshot](https://i.imgur.com/oZsXY5R.png)

The DateHistogram component is about representing how many records
were found during what periods of time. This component currently
doesn't offer interactive features, but you could use it as
inspiration to write another one that would allow you to dive in these
date ranges to see what records appear for each one of them.

Here's how you write a node of type `dateHistogram` in your _searchTree_:

```javascript
{
  key: 'releases',
  type: 'dateHistogram',
  key_field: 'released',
  value_field: 'imdbVotes',
  interval: '3650d',
}
```

**Note:** The properties present in the search tree that aren't used by the node
might be needed for the Provider's type. See the Provider type's
documentation in our [previous pages](README.md).

Since this component doesn't need any property from the node itself,
but only from the results, here's how you write your component:

```javascript
let DateHistogram = require('contexture-react/dist/exampleTypes').DateHistogram
let formatYear = x => new Date(x).getFullYear() + 1
// ...
// Later, on your render function, or where you put your components:
<DateHistogram path={['dateHistogram']} format={formatYear} tree={searchTree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type     | Default Value             | Description                                                                                                      |
| ------------- | -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `background`  | Function | `(record, max) => '#ccc'` | A function that returns the background color that is used to render each one of the bars in the resulting chart. |
| `height`      | Number   | `100`                     | Specifies the max height of the whole chart.                                                                     |
| `format`      | Function | `value => undefined`      | Allows you to change the value that each one of the bars has.                                                    |
| `gutter`      | Number   | `5`                       | Allows you to specify the spacing between bars.                                                                  |
| `yAxis`       | Boolean  | `false`                   | Allows you to specify wether you want Y axis information or not.                                                 |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the dateHistogram type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/dateHistogram.js).
- [(ElasticSearch Provider) Unit tests of the dateHistogram type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/dateHistogram.js).
- [Source code of the DateHistogram component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/DateHistogram.js).

## Facet

![Facet Type Screenshot](https://i.imgur.com/1X3mrfq.png)

The Facet component allows users to filter the results by picking a
specific common option among all the values that the records might
have for a specific field.

Here's how you write a node of type `facet` in your _searchTree_:

```javascript
{
  key: 'facet',
  type: 'facet',
  values: ['a'],
}
```

Here is the list of properties that this component expects to have on the node:

| Property Name | Type   | Required | Description                                                                                                                                                                                                           |
| ------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `values`      | Array  | Yes      | Array of selected values. To have a value selected by default, you will need to know in advance which value to put here, otherwise you can leave this with an empty array and let users select the values themselves. |
| `size`        | Number | No       | Max number of options to display. The default is 10.                                                                                                                                                                  |

**Note:** The properties present in the search tree that aren't used by the node
might be needed for the Provider's type. See the Provider type's
documentation in our [previous pages](README.md).

Here's how you write your component:

```javascript
let Facet = require('contexture-react/dist/exampleTypes').Facet
// ...
// Later, on your render function, or where you put your components:
<Facet path={['facet']} tree={searchTree}/>
```

| Property Name      | Type                                                     | Default Value | Description                                                                                                                                                                           |
| ------------------ | -------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hide.facetFilter` | Object (with an optional single property, `facetFilter`) | `{}`          | Allows you to hide the text input that helps on searching for the available options. This text input is very valuable when the results are larger than the available visible results. |
| `TextInput`        | Component                                                | `input`       | Allows you to customize the text input.                                                                                                                                               |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the facet type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/facet.js).
- [(ElasticSearch Provider) Unit tests of the facet type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/facet.js).
- [(MongoDb Provider) Source code of the facet type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/facet.js).
- [(MongoDb Provider) Unit tests of the facet type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/facet.js).
- [Source code of the Facet component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/Facet.js).

## Number

![Number Type Screenshot](https://i.imgur.com/Uuu16wy.png)

The Number component allows users to specify a numeric range to filter
the data based on the available results which values fit within this
range for a specific field.

Here's how you write a node of type `number` in your _searchTree_:

```javascript
{
  key: 'searchNumber',
  type: 'number',
  field: 'metaScore',
  min: 0,
  max: 100,
}
```

Here is the list of properties that this component expects to have on the node:

| Property Name | Type   | Required | Description                   |
| ------------- | ------ | -------- | ----------------------------- |
| `min`         | Number | No       | Minimum number for the range. |
| `max`         | Number | No       | Maximum number for the range. |

**Note:** The properties present in the search tree that aren't used by the node
might be needed for the Provider's type. See the Provider type's
documentation in our [previous pages](README.md).

Here's how you write your component:

```javascript
let Number = require('contexture-react/dist/exampleTypes').Number
// ...
// Later, on your render function, or where you put your components:
<Number path={['number']} tree={searchTree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type      | Default Value                         | Description                                                                                                                       |
| ------------- | --------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `NumberInput` | Component | `x => <input type="number" {...x} />` | Number input component. Useful for any style customization, and for libraries that (for example) wrap Bootstrap and it's classes. |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the number type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/number.js).
- [(ElasticSearch Provider) Unit tests of the number type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/number.js).
- [(MongoDb Provider) Source code of the number type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/number.js).
- [(MongoDb Provider) Unit tests of the number type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/number.js).
- [Source code of the Number component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/Number.js).

## ResultCount

![ResultCount Type Screenshot](https://i.imgur.com/htuXprD.png)

The ResultCount component will only show you the number of visible
results compared to the number of total results. It's not an
interactive component.

Most of your Contexture Trees will have a node with type `results`.
This node posesses information such as the resulting records
themselves, but also which page you're in, how many
elements are per page you will receive, and the total records there
are for this given query, which is what we're looking for for this
type.

All of these properties are automatically writen by the Contexture
architecture, so we'll be simply passing the tree and the path to the
results type node:

```javascript
let ResultCount = require('contexture-react/dist/exampleTypes').ResultCount
// ...
// Later, on your render function, or where you put your components:
<ResultCount path={['results']} tree={searchTree}/>
```

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/results.js).
- [(ElasticSearch Provider) Unit tests of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/results.js).
- [(MongoDb Provider) Source code of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/results.js).
- [(MongoDb Provider) Unit tests of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/results.js).
- [Source code of the ResultCount component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/ResultCount.js).

## ResultPager

![ResultPager Type Screenshot](https://i.imgur.com/h73I2QZ.png)

The ResultPager component is an interactive component that will show
you which page you're at (in the middle) and what pages are around
your current page, as well as some controllers to move forward and
backwards.

The style of this component isn't very friendly, but it's very easy to
customize. For more about theme changes, please visit our
[theming docs](../theming/README.md).

Most of your Contexture Trees will have a node with type `results`.
This node posesses information such as the resulting records
themselves, but also which page you're in, how many
elements are per page you will receive, and the total records there
are for this given query. We use a combination of those values to get
how many pages we can move forward (and backwards), and also to move
around these pages (since our trees react in real time).

All of these properties are automatically writen by the Contexture
architecture, so we'll be simply passing the tree and the path to the
results type node:

```javascript
let ResultPager = require('contexture-react/dist/exampleTypes').ResultPager
// ...
// Later, on your render function, or where you put your components:
<ResultPager path={['results']} tree={searchTree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type      | Default Value | Description                                                  |
| ------------- | --------- | ------------- | ------------------------------------------------------------ |
| `List`        | Component | `div`         | The component that wraps the whole list of pages.            |
| `Item`        | Component | `span`        | The component that wraps each of the available page numbers. |
| `Link`        | Component | `a`           | An element that wraps each one of the pagination controls.   |

To read more, check the following links:

- [(ElasticSearch Provider) Source code of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/results.js).
- [(ElasticSearch Provider) Unit tests of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/results.js).
- [(MongoDb Provider) Source code of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/results.js).
- [(MongoDb Provider) Unit tests of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/results.js).
- [Source code of the ResultPager component](https://github.com/smartprocure/contexture-react/blob/master/src/exampleTypes/ResultPager.js).

## ResultTable

![resulttable type screenshot](https://i.imgur.com/cc5urub.png)

The ResultTable is a component that will display a table with all the
available results, in which each of the result values will be
displayed as columns.

the results are automatically writen by the contexture architecture,
so we'll be simply passing the tree and the path to the results type
node:

```javascript
let resulttable = require('contexture-react/dist/exampletypes').resulttable
// ...
// later, on your render function, or where you put your components:
<resulttable path={['results']} tree={searchtree}/>
```

This component can be customized by passing any of the following
properties:

| Property Name | Type      | Default Value | Description                                         |
| ------------- | --------- | ------------- | --------------------------------------------------- |
| `Table`       | Component | `table`       | The component that wraps the table list of results. |

To read more, check the following links:

- [(ElasticSearch Provider) source code of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/src/example-types/results.js).
- [(elasticSearch Provider) unit tests of the results type](https://github.com/smartprocure/contexture-elasticsearch/blob/master/test/example-types/results.js).
- [(MongoDb Provider) source code of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/src/example-types/results.js).
- [(MongoDb Provider) unit tests of the results type](https://github.com/smartprocure/contexture-mongo/blob/master/test/example-types/results.js).
- [Source code of the ResultTable component](https://github.com/smartprocure/contexture-react/blob/master/src/exampletypes/ResultTable.js).
