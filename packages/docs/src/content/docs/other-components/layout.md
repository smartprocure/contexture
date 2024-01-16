---
title: Layout Components
---

### Awaiter

Renders a loading indicator until a Promise is resolved. It will ender
an exception (currently just `Ooops...`) if the Promise fails. if the
Promise passes, the children are rendered.

| Property Name | Type    | Required | Description                   |
| ------------- | ------- | -------- | ----------------------------- |
| `promise`     | Promise | Yes      | Minumum number for the range. |

Here's how you write your component:

```javascript
let Awaiter = require('contexture-react/dist/layout/Awaiter')
let promiseMaker = () => new Promise((resolve, reject)) /* ... */ resolve())
// ...
// Later, on your render function, or where you put your components:
<Awaiter promise={promiseMaker()}>
  <div>My Crazy Children</div>
</Awaiter>
```

- [Source code of the Awaiter component](https://github.com/smartprocure/contexture-react/blob/master/src/layout/Awaiter.js).

### BarChart

Allows you to build your own bar charts (besides just relying on
the DateHistogram component).

| Property Name   | Type                                                                  | Default Value        | Description                                                                          |
| --------------- | --------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------ |
| `valueField`    | String                                                                | `''`                 | The field of each record where the value used for the height of each barnis located. |
| `categoryField` | String                                                                | `''`                 | The field of each record where the label of each bar is located.                     |
| `data`          | Array (of Objects with both the `valueField` and the `categoryField`) | `[]`                 | The data that is going to be used to build the chart.                                |
| `height`        | Number                                                                | `100`                | Specifies the max height of the whole chart.                                         |
| `format`        | Function                                                              | `value => undefined` | Allows you to change the value that each one of the bars has.                        |
| `gutter`        | Number                                                                | `5`                  | Allows you to specify the spacing between bars.                                      |
| `yAxis`         | Boolean                                                               | `false`              | Allows you to specify wether you want Y axis information or not.                     |

Here's how you write your component:

```javascript
let BarChart = require('contexture-react/dist/layout/BarChart')
// ...
// Later, on your render function, or where you put your components:
<BarChart
  valueField="value"
  categoryField="category"
  data={[
    {
      value: 1,
      category: 'Category L'
    },
    {
      value: 3,
      category: 'Category E1'
    },
    {
      value: 3,
      category: 'Category E2'
    },
    {
      value: 7,
      category: 'Category T'
    },
  ]}
  />
```

- [Source code of the BarChart component](https://github.com/smartprocure/contexture-react/blob/master/src/layout/BarChart.js).

### SpacedList

Wraps every children in a div with a given style. Useful for (as the
name portrays) making a spaced list.

| Property Name | Type   | Required | Description                                                                         |
| ------------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| `style`       | Object | No       | The style that will be applied to each div. Defaults in `{ marginBottom: '25px' }`. |

Here's how you write your component:

```javascript
let SpacedList = require('contexture-react/dist/layout/SpacedList')
// ...
// Later, on your render function, or where you put your components:
<SpacedList>
  <h1>Hi</h1>
  <input type="text" />
</SpacedList>
```

- [Source code of the SpacedList component](https://github.com/smartprocure/contexture-react/blob/master/src/layout/SpacedList.js).

### TextHighlight

Used to highlight content within a text basef on a pattern.

| Property Name             | Type      | Required | Description                                   |
| ------------------------- | --------- | -------- | --------------------------------------------- |
| `pattern`                 | String    | No       | RegExp pattern used to find matching content. |
| `text`                    | String    | Yes      | Text used as the target of the matches.       |
| `Wrap`                    | Component | No       | Component used to wrap each one of the        |
| matched. Defaults to `i`. |

Here's how you write your component:

```javascript
let TextHighlight = require('contexture-react/dist/layout/TextHighlight')
// ...
// Later, on your render function, or where you put your components:
<TextHighlight text="This is awesome!" pattern="awe" />
```

- [Source code of the TextHighlight component](https://github.com/smartprocure/contexture-react/blob/master/src/layout/TextHighlight.js).
