# Theme API

A theme in contexture-react is simply an object -- which we'll call a **theme object** for clarity -- that maps **theme keys** to React components. The theme object lives inside contexture-react's `ThemeContext`, which uses React context under the hood.

Since they are really just identifiers for components, theme keys should follow the same naming conventions as React components themselves. For the purpose of consuming the API, we'll refer to a theme key together with the component it identifies as a **theme component**.

## Using the Theme API

To use **theme components** inside your own component definitions, your component must pull them from the theme object within contexture-react's `ThemeContext`.

There are two ways to get the theme from context: the `ThemeConsumer` component, and the `withTheme` function.

### ThemeConsumer

The `ThemeConsumer` helper component takes a render function as its child, and passes the **theme object** from context into that function. This example demonstrates how to create a basic IconButton component using the `Icon` and `Button` **theme components**, plus `ThemeConsumer`:

```jsx
// IconButton.js

import React from 'react'
import { ThemeConsumer } from 'contexture-react/src/utils/theme'

let IconButton = ({ icon, children, ...props }) => (
  <ThemeConsumer>
    {theme =>
      <theme.Button {...props}>
        <theme.Icon icon={icon} />
        {children}
      </theme.Button>
    }
  </ThemeConsumer>
)
export default IconButton
```

### withTheme

The `withTheme` higher-order component injects the theme object from context into its component argument as the `theme` prop. Here is the same IconButton example using `withTheme`:

```jsx
// IconButton.js

import React from 'react'
import { withTheme } from 'contexture-react/src/utils/theme'

let IconButton = ({ theme, icon, children, ...props }) => (
  <theme.Button {...props}>
    <theme.Icon icon={icon} />
    {children}
  </theme.Button>
)
export default withTheme(IconButton)
```

`ThemeConsumer` and `withTheme` both accomplish the same thing in different ways. You're free to use whichever one you like best. 🙂


## Default theme components

The default theme in contexture-react is GreyVest. The full list of **theme components** included in GreyVest is shown in the table below.

| Key | Expected props | Notes |
| --- | --- | --- |
| `AdderPicker` | `options`, `onChange`, `label` | *this key is actually based on specific usage in the FilterAdder component, and should probably just be removed from the defaults in favor of a nested style* |
| `BarChart` | `height`, `borderColor`, `min`, `max` | Used in the DateHistogram and TermsStats example types |
| `Box` | `children` | A generic container element |
| `Button` | `isActive`, `primary`, `onClick`, `children` | A generic button |
| `Checkbox` | `checked`, `onChange` | A generic checkbox |
| `CheckButton` | `checked`, `onClick`, `children` | A button with an `onClick` handler and an on/off state, containing a checkbox that displays this state *(this really should be extrapolated to some kind of generic BinaryStateButton)* |
| `ExpandableTable` | `data`, `columns`, `recordKey`, `sortField`, `sortDir`, `columnSort` | Used in the TermsStatsTable and CheckableTermsStatsTable example types |
| `Icon` | `icon`, `onClick` | A generic icon component |
| `Fonts` | none | For holding `<link>` elements to fonts used in the theme |
| `Input` | same as basic `input` | A generic input component |
| `ListItem` | `children` | A generic list item |
| `MissingTypeComponent` | `node` | Used as a fallback component in search interfaces when no other component is found for a node's contexture type |
| `Modal` | `isOpen`, `children` | A generic modal component |
| `PagerItem` | `active`, `disabled` | A list item for Pager components *(make this nested instead?)* |
| `Picker` | `options`, `onChange` | Renders a list of selectable options |
| `PickerItem` | `active`, `disabled` | A list item for Picker components *(make this nested instead?)* |
| `Popover` | `isOpen`, `children` | A generic context-menu component |
| `RadioList` | `options`, `value`, `onChange` | A generic list of radio buttons |
| `Style` | none | For rendering a `<style>` block with theme-specific styles |
| `Table` | same as basic `table` | A generic table component |
| `Tag` | `value`, `removeTag`, `tagStyle`, `onClick` | Used in TagsInput |
| `TagsInput` | | Used in the TagsQuery and TagsText example types |
| `TextHighlight` | `pattern`, `text`, `Wrap` | Renders the text given in the `text` prop, with the parts that match the `pattern` prop wrapped in the `Wrap` component |

## Using a custom theme

To create a custom theme, simply declare an object that maps one or more **theme keys** to your own components:

```jsx
// totallyTubularTheme.js

import BeautifulButton from './components/BeautifulButton'
import ImpressiveIcon from './components/ImpressiveIcon'

export default {
  Button: BeautifulButton,
  Icon: ImpressiveIcon
}
```

> *Note:* any theme components that are not specified in your custom theme will default to the GreyVest theme components.

To use your custom theme, simply pass it to a contexture-react ThemeProvider using the `theme` prop. Here's a basic example using the IconButton component we created earlier:

```jsx
// SomeComponent.js

import { ThemeProvider } from 'contexture-react/src/utils/theme'
import theme from './totallyTubularTheme.js'
import IconButton from './components/IconButton.js'

export default props => (
  <ThemeProvider theme={theme}>
    {/* Some other stuff... */}
    <IconButton icon="some-icon">
      My icon button!
    </IconButton>
  </ThemeProvider>
)
```

The IconButton component should now render your BeautifulButton and ImpressiveIcon components, rather than the GreyVest button and icon.

### Using your own theme keys

(nothing fancy, but there should still be an example of this)

## Advanced stuff

coming later

### Nested themes

### Overriding context with `theme` props

