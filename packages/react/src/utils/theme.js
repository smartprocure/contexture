import React from 'react'

let inputType = (type) => (props) => <input type={type} {...props} />

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

export let useTheme = () => React.useContext(ThemeContext)

export let ThemeConsumer = ({ children, theme }) =>
  children({ ...useTheme(), ...theme })

export let withTheme =
  (Component) =>
  ({ theme, ...props }) =>
    <Component theme={{ ...useTheme(), ...theme }} {...props} />
