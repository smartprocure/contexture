import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { mergeOrReturn } from './futil'
import { getDisplayName } from './react'

let inputType = type => props => <input type={type} {...props} />

// We populate the default theme by mutating this in src/layout/index.js, to
// avoid importing withTheme-wrapped components before the function is defined.
export let defaultTheme = {
  Checkbox: inputType('checkbox'),
  DateInput: inputType('date'),
  NumberInput: inputType('number'),
  TextInput: inputType('text'),
  Box: 'div',
  Root: 'div',
  AlternateButton: 'button',
  Button: 'button',
  TextButton: 'button',
  ButtonGroup: 'div',
  Icon: 'div',
  DropdownItem: 'div',
  NestedPicker: 'div',
  Modal: 'dialog',
  Popover: 'dialog',
  PagerItem: 'span',
  RadioList: 'div',
  Select: 'select',
  Tag: 'span',
  TextHighlight: 'strong',
  Table: 'table',
  Thead: 'thead',
  Tbody: 'tbody',
  Tfoot: 'tfoot',
  Tr: 'tr',
  Th: 'th',
  Td: 'td',
}

let ThemeContext = React.createContext(defaultTheme)

export let ThemeProvider = ({ theme, children }) => {
  theme = { ...defaultTheme, ...theme }
  let Root = theme.Root || React.Fragment
  return (
    <ThemeContext.Provider value={theme}>
      <Root>{children}</Root>
    </ThemeContext.Provider>
  )
}

let hasNested = key => F.findIndexed((v, k) => _.startsWith(`${key}.`, k))

export let mergeNestedTheme = (theme, key) =>
  F.when(
    hasNested(key),
    _.flow(
      _.pickBy((val, k) => _.startsWith(`${key}.`, k)),
      _.mapKeys(_.replace(`${key}.`, '')),
      _.defaults(theme)
    )
  )(theme)

export let useTheme = (name, propTheme) =>
  mergeOrReturn(
    mergeNestedTheme(React.useContext(ThemeContext), name),
    propTheme
  )

export let ThemeConsumer = ({ name, children, theme }) => {
  let newTheme = useTheme(name, theme)
  return (
    <ThemeContext.Provider value={newTheme}>
      {children(newTheme)}
    </ThemeContext.Provider>
  )
}

export let withNamedTheme = name => Component => {
  let themed = ({ theme, ...props }) => {
    let newTheme = useTheme(name, theme)
    return (
      <ThemeContext.Provider value={newTheme}>
        <Component {...props} theme={newTheme} />
      </ThemeContext.Provider>
    )
  }
  themed.displayName = `withTheme${name ? `("${name}")` : ''}(${getDisplayName(
    Component
  )})`
  return themed
}

export let withTheme = withNamedTheme()
