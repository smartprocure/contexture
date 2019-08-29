# Theme API

A theme in contexture-react is simply an object -- which we'll call a **theme object** for clarity -- that maps **theme keys** to React components. The theme object lives inside contexture-react's `ThemeContext`, which uses React context under the hood.

Since they are really just identifiers for components, theme keys should follow the same naming conventions as React components themselves. For the purpose of consuming the API, we'll refer to a theme key together with the component it identifies as a **theme component**.

The contexture-react theme API supports two methods of overriding themes: on a per-instance basis by passing a **theme object** as a prop, and on a per-key basis through **nested themes** (which we'll talk more about in the [Nested themes](#nested-themes) section).

## Initializing the Theme API

To start using themes, simply wrap your application in contexture-react's `ThemeProvider`:

```jsx
import { ThemeProvider } from 'contexture-react'
import { greyVest } from 'contexture-react/themes' // or use your own!

function App() {
  return (
    <ThemeProvider theme={greyVest}>
      {/* rest of your app */}
    </ThemeProvider>
  );
}
```

`ThemeProvider` accepts a `theme` prop containing a **theme object**.

> ℹ️ **Note:** contexture-react provides a basic **fallback theme** to all components that consume its theme API, to help prevent render errors if you forget to initialize `ThemeProvider` with a `theme` prop (or even leave out `ThemeProvider` altogether 😱). See the [Default theme components](#default-theme-components) section for more details.

### Globals

`Globals` is a special **theme key** that allows you to include global components such as styles, fonts, or other providers within your theme. When `ThemeProvider` is rendered, it *wraps its own children in the `Globals` **theme component*** if one exists on the provided theme:

```jsx
export let ThemeProvider = ({ theme, children }) => {
  theme = { ...defaultTheme, ...theme }
  let Globals = theme.Globals || React.Fragment
  return (
    <ThemeContext.Provider value={theme}>
      <Globals>{children}</Globals>
    </ThemeContext.Provider>
  )
}
```
<sup>^ The actual source code for ThemeProvider</source>

> ⚠️ **IMPORTANT:** If you use a `Globals` theme component, it ***must*** handle its `children` prop, or nothing inside of `ThemeProvider` will render!

## Consuming the Theme API

To use **theme components** inside your own component definitions, your component must pull them from the **theme object** within `ThemeContext`.

There are three ways to get the theme from context: the `ThemeConsumer` component, the `withTheme` function, and the `useTheme` hook.

### ThemeConsumer

The `ThemeConsumer` helper component takes a render function as its child, and passes the **theme object** from context into that function. This example demonstrates how to create a basic `IconButton` component using the `Icon` and `Button` **theme components**, plus `ThemeConsumer`:

```jsx
// IconButton.js

import React from 'react'
import { ThemeConsumer } from 'contexture-react'

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

The `ThemeConsumer` component takes two optional props: `name`, which accepts a string and can be used to supply a name for [nested theming](#nested-themes), and `theme`, which accepts a **theme object** that is merged with the context theme, overriding its values where applicable.

When a nested theme is merged, or when the context theme is overridden by a `theme` prop, `ThemeConsumer` *creates a theme provider with the new theme object*. This ensures that that any of its children or grandchildren or grandchildren that consume the theme API will be able to access the updated theme object from context.

### withTheme

The `withTheme` higher-order component injects the theme object from context into its component argument as a `theme` prop. Here is the same `IconButton` example using `withTheme`:

```jsx
// IconButton.js

import React from 'react'
import { withTheme } from 'contexture-react'

let IconButton = ({ theme, icon, children, ...props }) => (
  <theme.Button {...props}>
    <theme.Icon icon={icon} />
    {children}
  </theme.Button>
)
export default withTheme(IconButton)
```

Directly passing a `theme` prop to the `withTheme` component -- in our case, the `IconButton` component that is exported from this file -- overrides the context theme for the component and its children, just like `ThemeConsumer`'s `theme` prop does.

If you need to give your component a `name` for nested themes, use the `withNamedTheme` function instead. (See the [Nested themes](#nested-themes) section for more details.)

`ThemeConsumer` and `withTheme` both accomplish the same thing in different ways. You're free to use whichever one you like best. 🙂

### useTheme

The `useTheme` hook functions just like the other two methods, with one important exception: *`useTheme` does **not** create a new theme provider, so it cannot affect the theme context for the component's children.*

Here's the IconButton example with `useTheme`:

```jsx
// IconButton.js

import React from 'react'
import { useTheme } from 'contexture-react'

let IconButton = ({ icon, children, ...props }) => {
  let theme = useTheme()
  return (
    <theme.Button {...props}>
      <theme.Icon icon={icon} />
      {children}
    </theme.Button>
  )
}
export default IconButton
```

`useTheme` takes two optional arguments, `name` and `theme`, and returns a **theme object**. Just like with `ThemeConsumer`, the `name` parameter accepts a string and is used to merge nested themes, while the `theme` parameter accepts a **theme object** that is used to selectively override the context theme.

These potential modifications to the context theme *do* affect `useTheme`'s return value, so they are still useful for the component itself. However, as noted, `useTheme` does *not* create a new theme provider for its children, so any overrides will *not* be propagated further down the component tree.

> 💁 **Trivia:** The `useTheme` hook is used internally by both `ThemeConsumer` and `withTheme`.

## Default theme components

This section documents all of the **theme components** used by contexture-react itself, along with the API for each one. The **theme keys** in this list all have fallback components available, so overriding them in custom themes is optional.

### Inputs

| Key | Expected props | Notes | ExampleTypes usage |
| --- | --- | --- | --- |
| `Button` | `isActive`, `primary`, `onClick`, `children` | A generic button | Facet, Number, TagsQuery, TermsStatsTable |s
| `Checkbox` | `checked`, `onChange` | A generic checkbox | CheckableResultTable, CheckableTermsStatsTable, Facet, TagsQuery |
| `Icon` | `icon`, `onClick` | A generic icon component | ResultPager, ResultTable |
| `RadioList` | `options`, `value`, `onChange` | A generic list of radio buttons. The `options` prop is an array of `{ value, label }` objects. | Bool, Date, Exists, Facet, TagsQuery |
| `Select` | same as basic `select` | A generic dropdown select component | Date, DateRangePicker, Geo, TagsJoinPicker, TagsQuery, TagsText, TermsStatsTable |
| `TextInput` |  same as basic `input` | A generic text input component | Facet, Query, TermsStatsTable, Text |
| `DateInput` | `value`, `onChange` | A generic date entry component | Date |
| `NumberInput` | same as basic `input` | An input of type `number` | Geo, Number |
| `TagsInput` | `tags`, `addTag`, `removeTag`, `submit`, `tagStyle`, `placeholder`, `splitCommas`, `style`, `onBlur`, `onInputChange`, `onTagClick` | A text input field that turns input into `Tag`s | TagsQuery, TagsText |
| `PopoverTagsInput` | same as TagsInput, plus `PopoverContents` | A TagsInput that opens a popover when a tag is clicked. Uses the `TagsInput` theme component. | TagsQuery, TagsText |
| `Tag` | `value`, `removeTag`, `tagStyle`, `onClick` | A tag component with a button to remove the tag. Used in TagsInput. | none |
| `Picker` | `options`, `onChange` | Renders a list of selectable options | ResultTable |
| `ModalPicker` | `options`, `onChange`, `label` | A picker inside a modal, with a button to open it. Uses `Picker`, `Button`, and `Modal` theme components. | none |

### Containers

| Key | Expected props | Notes | ExampleTypes usage |
| --- | --- | --- | --- |
| `Box` | `children` | A generic container element | none |
| `Modal` | `isOpen`, `children` | A generic modal component | ResultTable |
| `Popover` | `isOpen`, `children` | A generic context-menu component | ResultTable |
| `DropdownItem` | `children` | A generic list item used in dropdown menus | ResultTable |
| `PagerItem` | `active`, `disabled` | A list item for Pager components | ResultPager |
| `PickerItem` | `active`, `disabled` | A list item for Picker components | none |
| `TextHighlight` | `pattern`, `text`, `Wrap` | Renders the text given in the `text` prop, with the parts that match the `pattern` prop wrapped in the `Wrap` component | none |
| `Table` | same as basic `table` | A generic table component | ResultTable |
| `TableCell` | same as `td` | A generic table cell | ResultTable |
| `TableHeaderCell` | same as `th` | A generic table header | ResultTable |
| `TableRow` | same as `tr` | A generic table row | ResultTable |

### Other

| Key | Expected props | Notes |
| --- | --- | --- |
| `Globals` | `children` | This component is rendered inside `ThemeProvider`, and wraps its children. For use with other providers and/or standalone globals like stylesheets. |
| `BarChart` | `height`, `borderColor`, `min`, `max` | Used in the DateHistogram and TermsStats example types |
| `MissingTypeComponent` | `node` | Used as a fallback component in search interfaces when no other component is found for a node's contexture type |


## Theme Authoring

To create a theme, simply declare an object that maps one or more **theme keys** to your own components:

```jsx
// totallyTubularTheme.js

import BeautifulButton from './components/BeautifulButton'
import ImpressiveIcon from './components/ImpressiveIcon'

export default {
  Button: BeautifulButton,
  Icon: ImpressiveIcon
}
```

> ℹ️ **Note:** Any theme component that is not specified in your custom theme will default to a generic fallback component, as long as its key is in the [list above](#default-theme-components).

To use your custom theme, pass it to a contexture-react `ThemeProvider` using the `theme` prop. Here's a basic example using the `IconButton` component we created earlier:

```jsx
// SomeComponent.js

import { ThemeProvider } from 'contexture-react/src/utils/theme'
import totallyTubularTheme from './totallyTubularTheme.js'
import IconButton from './components/IconButton.js'

export default props => (
  <ThemeProvider theme={totallyTubularTheme}>
    {/* Some other stuff... */}
    <IconButton icon="some-icon">
      My icon button!
    </IconButton>
  </ThemeProvider>
)
```

The `IconButton` component should now render your `BeautifulButton` and `ImpressiveIcon` components, rather than the default button and icon.

## Nested themes

A **nested theme** is a special case of **theme component**: one whose **theme key** is a *path* rather than a *string*. Nested themes allow a single **theme key** -- like, say, `Icon` -- to have an alternate value for some specific parent or chain of parents, in addition to its normal value.

To illustrate nested themes, we'll be modifying our `totallyTubularTheme` from the previous section to use a **nested key** for `IconButton`'s `Icon`, in addition to the standard `Icon`:

```jsx
// totallyTubularTheme.js

import BeautifulButton from './components/BeautifulButton'
import ImpressiveIcon from './components/ImpressiveIcon'
import InvisibleIcon from './components/InvisibleIcon'

export default {
  Button: BeautifulButton,
  Icon: ImpressiveIcon,
  'IconButton.Icon': InvisibleIcon
}
```

This theme object tells contexture-react to use `InvisibleIcon` as the `Icon` component for `IconButton` and its children, while still using `ImpressiveIcon` as the `Icon` component throughout the rest of our app.

Now that our theme is configured to use a nested theme for `IconButton`, we need to assign a name to our component in order to use it.

### Naming components

> ⚠️ **IMPORTANT:** *Only named components support nested themes.* A component ***must*** be given a `name` in order to support nested themes.

When a component is given a `name` through `ThemeConsumer`, `withNamedTheme`, or `useTheme`, contexture-react performs an additional step after it fetches the theme from context: it looks for **nested keys** that start with that `name`, chops the `name` off of each one, and merges the resulting theme components on top of the context theme, overriding its existing components where applicable. Thus, for any component named `'IconButton'`, the theme object it receives will look like this:

```js
{
  Button: BeautifulButton,
  Icon: InvisibleIcon, // <-- overridden!
  'IconButton.Icon': InvisibleIcon
}
```

This behavior *does not mutate the context theme*, so `IconButton`'s siblings and parents are not affected. However, both `ThemeConsumer` and `withTheme`/`withNamedTheme` initialize new theme providers, so that the overrides will remain in context for their children's children. 

> ℹ️ **Note:** Remember that `useTheme` does *not* initialize a new provider, so it is **not** the best choice for use with nested themes.

Naming your components is dead simple:

#### Using `ThemeConsumer`
```jsx
let IconButton = ({ icon, children, ...props }) => (
  <ThemeConsumer name="IconButton">
    {/* theme => ... */}
  </ThemeConsumer>
)
export default IconButton
```

#### Using `withNamedTheme`

`withNamedTheme` takes a `name` argument and returns `withTheme`. It's used like this:

```jsx
import { withNamedTheme } from 'contexture-react'

/* let IconButton = ... */

export default withNamedTheme('IconButton')(IconButton)
```

#### Using `useTheme`

(Again, seriously not recommended unless you really know what you're doing):

```jsx
let IconButton = ({ icon, children, ...props }) => {
  let theme = useTheme('IconButton')
  /* return ( ... */
}
export default IconButton
```
