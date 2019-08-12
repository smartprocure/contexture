# Layout

## Awaiter

### Props

`children`,
`promise`

## BarChart

### Props

`background`,
`categoryField`,
`data`,
`format`,
`gutter`,
`height`,
`valueField`,
`yAxis`

## Checkbox

### Props

`...props` recipient: `input`

## CheckButton

### Props

`checked`,
`children`,
`onClick`

`...props` recipient: `theme.Button`

### Theme

| Component  | Default         |
| ---------- | --------------- |
| `Button`   | `'button'`      |
| `Checkbox` | layout/Checkbox |

## Dynamic

### Props

`component`

`...props` recipient: `component`

## ExpandableTable

### Props

`columns`,
`columnSort`,
`data`,
`recordKey`,
`sortDir`,
`sortField`

`...props` recipient: `table`

## Flex

### Props

`alignContent`,
`alignItems`,
`as`,
`column`,
`justifyContent`,
`style`,
`wrap`

`...props` recipient: `props.as`

## Grid

### Props

`columns`,
`gap`,
`style`

`...props` recipient: `div`

## LensInput

### Props

`lens`

`...props` recipient: `theme.Input`

### Theme

| Component | Default   |
| --------- | --------- |
| `Input`   | `'input'` |

## Modal

### Props

`children`,
`className`,
`isOpen`,
`style`

## ModalPicker

### Props

`label`,
`onChange`,
`options`

### Theme

| Component | Default             |
| --------- | ------------------- |
| `Button`  | `'button'`          |
| `Modal`   | layout/Modal        |
| `Picker`  | layout/NestedPicker |

## NestedPicker

### Props

### Theme

| Component | Default   |
| --------- | --------- |
| `Input`   | `'input'` |

#### FilteredSection

| Component   | Default              |
| ----------- | -------------------- |
| `Highlight` | layout/TextHighlight |
| `Item`      | local to file        |

#### Section

| Component | Default       |
| --------- | ------------- |
| `Item`    | local to file |

## NumberInput

`...props` recipient: `input`

## Popover

### Props

`children`,
`isOpen`,
`style`

## Portal

### Props

`children`, `node`

## RadioList

### Props

`onChange`,
`options`,
`value`

`...props` recipient: `div`

## Select

### Props

`options`,
`placeholder`

`...props` recipient: `select`

## SpacedList

### Props

`children`,
`style`

## StepsAccordion

### Props

`children`, `onSubmit`

`...props` recipient: `div`

#### AccordionStep

`children`,
`className`,
`currentStep`,
`isRequired`,
`onSubmit`,
`step`,
`style`,
`title`,
`totalSteps`

### Theme

#### AccordionStep

| Component | Default         |
| --------- | --------------- |
| `Icon`    | src/DefaultIcon |

#### Buttons

| Component | Default         |
| --------- | --------------- |
| `Button`  | `'button'`      |
| `Icon`    | src/DefaultIcon |

## TagsInput

### Props

`addTag`,
`placeholder`,
`removeTag`,
`splitCommas`,
`state`,
`style`,
`submit`,
`tags`,
`tagStyle`,
`theme`

`...props` recipient: `div`

### Theme

| Component         | Default        |
| ----------------- | -------------- |
| `Popover`         | layout/Popover |
| `PopoverContents` | `'div'`        |
| `TagComponent`    | local to file  |

#### Tag

| Component    | Default       |
| ------------ | ------------- |
| `RemoveIcon` | local to file |

## TextHighlight

### Props

`pattern`,
`text`

### Theme

| Component | Default |
| --------- | ------- |
| `Wrap`    | `'i'`   |

## WrappedDateInput

### Props

`onChange`,
`value`
