# QueryBuilder

## QueryBuilder

### Theme

| Component | Default  |
| --------- | -------- |
| `Button`  | 'button' |

## Group

### Props

`isRoot`
`node`,
`parent`,
`state`,
`tree`,

#### GroupItem

`child`
`connectDragSource`
`index`
`isRoot`
`node`
`parent`
`state`
`theme`
`tree`

## Rule

## Props

`connectDragSource`,
`isDragging`,
`node`,
`parent`,
`state`,
`tree`,

`...props` recipient: `FilterContents`

## Operator

### Props

`child`,
`index`,
`node`,
`parent`,
`parentState`,
`state`,
`tree`

#### OperatorMenu

`node`,
`parent`,
`parentState`,
`tree`

### Theme

| Component | Default        |
| --------- | -------------- |
| `Popover` | layout/Popover |

## FilterContents

### Props

`fields`,
`mapNodeToProps`,
`node`,
`tree`,
`types`

### Theme

| Component              | Default                         |
| ---------------------- | ------------------------------- |
| `Button`               | 'button'                        |
| `MissingTypeComponent` | src/DefaultMissingTypeComponent |
| `Modal`                | layout/Modal                    |
| `Picker`               | layout/NestedPicker             |
| `Popover`              | layout/Popover                  |

# FilterList

## FilterList

### Props

#### FilterActions

`fields`,
`modal`,
`node`,
`popover`,
`tree`

#### Label

`fields`,
`modal`,
`node`,
`popover`,
`tree`

`...props` recipient: `span`

### Theme

| Component              | Default                         |
| ---------------------- | ------------------------------- |
| `MissingTypeComponent` | src/DefaultMissingTypeComponent |

#### FilterActions

| Component | Default             |
| --------- | ------------------- |
| `Item`    | `'li'`              |
| `Modal`   | layout/Modal        |
| `Picker`  | layout/NestedPicker |
| `Popover` | layout/Popover      |

#### Label

| Component | Default         |
| --------- | --------------- |
| `Icon`    | src/DefaultIcon |
