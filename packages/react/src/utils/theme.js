import React from 'react'
import _ from 'lodash/fp'

let ThemeContext = React.createContext()

export let ThemeProvider = ({ children, theme }) =>
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>

export let mergeNestedTheme = (key = '', theme) => _.flow(
  _.pickBy((val, k) => _.startsWith(`${key}.`, k)),
  _.mapKeys(x => _.replace(`${key}.`, '', x)),
  _.defaults(theme)
)(theme || React.useContext(ThemeContext))

export let mergeNestedThemePath = (path, theme) => _.reduce(
  (acc, key) => mergeNestedTheme(key, acc), 
  theme || React.useContext(ThemeContext), 
  path || []
)

export let ThemeConsumer = ({ children, path }) => children(mergeNestedThemePath(path))

export let withTheme = (defaults = {}, name) => Component => ({ theme: propTheme, ...props }) => {
  name = name || Component.displayName || Component.name
  let contextTheme = mergeNestedTheme(name, React.useContext(ThemeContext))

  let newTheme = _.mergeAll([defaults, contextTheme, propTheme])

  return (
    <ThemeProvider theme={newTheme}>
      <Component {...props} theme={newTheme} />
    </ThemeProvider>
  )
}
