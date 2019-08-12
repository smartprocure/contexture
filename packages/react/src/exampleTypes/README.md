# Example Types

## Bool

### Props

`node`, `tree`

### Theme

| Component   | Default          |
| ----------- | ---------------- |
| `RadioList` | layout/RadioList |

## CheckableResultTable

### Props

`fields`,
`getValue`,
`node`,
`selected`

`...props` recipient: `theme.ResultTable`

### Theme

| Component     | Default                  |
| ------------- | ------------------------ |
| `Checkbox`    | layout/Checkbox          |
| `ResultTable` | exampleTypes/ResultTable |

## CheckableTermsStatsTable

### Props

`children`,
`getValue`,
`node`,
`selected`

`...props` recipient: `theme.TermsStatsTable`

### Theme

| Component         | Default                         |
| ----------------- | ------------------------------- |
| `Checkbox`        | layout/Checkbox                 |
| `Column`          | layout/ExpandableTable > Column |
| `TermsStatsTable` | exampleTypes/TermsStatsTable    |

## Date

### Props

`excludeRollingRanges`,
`node`,
`tree`

### Theme

| Component   | Default          |
| ----------- | ---------------- |
| `RadioList` | layout/RadioList |

## DateHistogram

### Props

`node`

`...props` recipient: `theme.BarChart`

### Theme

| Component  | Default         |
| ---------- | --------------- |
| `BarChart` | layout/BarChart |

## DateRangePicker

### Props

`node`,
`ranges`,
`tree`

### Theme

| Component | Default       |
| --------- | ------------- |
| `Select`  | layout/Select |

## Exists

### Props

`node`,
`tree`

### Theme

| Component   | Default          |
| ----------- | ---------------- |
| `RadioList` | layout/RadioList |

## Facet

### Props

`display`,
`displayBlank`,
`formatCount`,
`hide`,
`node`,
`tree`

### Theme

| Component   | Default         |
| ----------- | --------------- |
| `Checkbox`  | layout/Checkbox |
| `RadioList` | local to file   |

#### FacetOptionsFilter

| ------------- | ---------------- |
| `Button` | `'button'` |
| `ButtonGroup` | `'div'` |
| `TextInput` | `'input'` |

#### SelectAll

| Component  | Default         |
| ---------- | --------------- |
| `Checkbox` | layout/Checkbox |

## Geo

### Props

`tree`,
`node`,
`loadOptions`,
`GeoCodeLocation`,
`AutoComplete`,
`placeholder`

### Theme

| Component     | Default            |
| ------------- | ------------------ |
| `NumberInput` | layout/NumberInput |
| `SelectInput` | `'select'`         |

## Number

### Props

`formatter`,
`node`,
`showBestRange`,
`significantDigits`,
`tree`

### Theme

| Component     | Default            |
| ------------- | ------------------ |
| `Button`      | `'button'`         |
| `NumberInput` | layout/NumberInput |

## Query

### Props

`node`,
`tree`

### Theme

| Component   | Default   |
| ----------- | --------- |
| `TextInput` | `'input'` |

## ResultCount

### Props

`display`,
`node`

## ResultPager

### Props

`className`,
`node`,
`tree`

### Theme

| Component | Default         |
| --------- | --------------- |
| `Icon`    | src/DefaultIcon |
| `Item`    | local to file   |
| `Link`    | local to file   |

## ResultTable

### Props

`criteria`,
`fields`,
`infer`,
`mapNodeToProps`,
`node`,
`path`,
`tree`,
`typeComponents`

### Theme

| Component | Default   |
| --------- | --------- |
| `Table`   | `'table'` |

#### HighlightedColumnHeader

| Component | Default |
| --------- | ------- |
| `Cell`    | `'th'`  |

#### HighlightedColumn

| Component | Default      |
| --------- | ------------ |
| `Cell`    | `'td'`       |
| `Modal`   | layout/Modal |
| `Table`   | `'table'`    |

#### Header

| Component     | Default             |
| ------------- | ------------------- |
| `FieldPicker` | layout/NestedPicker |
| `HeaderCell`  | local to file       |
| `Icon`        | src/DefaultIcon     |
| `Item`        | `'span'`            |
| `Popover`     | layout/Popover      |

#### TableBody

| Component | Default       |
| --------- | ------------- |
| `Cell`    | `'td'`        |
| `Row`     | local to file |

## TagsJoinPicker

### Props

`node`, `tree`

### Theme

| Component | Default       |
| --------- | ------------- |
| `Select`  | layout/Select |

## TagsQuery

### Props

`tree`,
`node`,
`placeholder`

`...props` recipient: `theme.TagsInput`

### Theme

| Component   | Default          |
| ----------- | ---------------- |
| `Button`    | `'button'`       |
| `Checkbox`  | layout/Checkbox  |
| `RadioList` | layout/RadioList |
| `Select`    | layout/Select    |
| `TagsInput` | layout/TagsInput |

## TagsText

### Props

`tree`,
`node`,
`placeholder`

### Theme

| Component   | Default          |
| ----------- | ---------------- |
| `Select`    | layout/Select    |
| `TagsInput` | layout/TagsInput |

## TermsStats

### Props

`node`

`...props` recipient: `theme.BarChart`

### Theme

| Component  | Default         |
| ---------- | --------------- |
| `BarChart` | layout/BarChart |

## TermsStatsTable

### Props

`children`,
`criteria`,
`criteriaField`,
`criteriaFieldLabel`,
`criteriaGetValue`,
`node`,
`sizeOptions`,
`tree`

`...props` recipient: `theme.ExpandableTable`

### Theme

| Component         | Default                         |
| ----------------- | ------------------------------- |
| `Button`          | `'button'`                      |
| `Column`          | layout/ExpandableTable > Column |
| `ExpandableTable` | layout/ExpandableTable          |
| `Input`           | `'input'`                       |
| `MoreControls`    | `'div'`                         |

#### SimpleFilter

| Component     | Default       |
| ------------- | ------------- |
| `Input`       | `'input'`     |
| `SimpleLabel` | local to file |

#### SelectSize

| Component     | Default       |
| ------------- | ------------- |
| `Select`      | layout/Select |
| `SimpleLabel` | local to file |

## Text

### Props

`node`,
`prop`,
`tree`

`...props` recipient: `theme.Input`

### Theme

| Component | Default   |
| --------- | --------- |
| `Input`   | `'input'` |
