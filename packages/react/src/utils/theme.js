import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { mergeOrReturnAll } from './futil'
import { getDisplayName } from './react'

// We populate the default theme by mutating this in src/layout/index.js, to
// avoid importing withTheme-wrapped components before the function is defined.
export let defaultTheme = {}
let ThemeContext = React.createContext(defaultTheme)
export let ThemeProvider = ThemeContext.Provider

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

let useTheme = (name, propTheme) =>
  mergeOrReturnAll([
    defaultTheme,
    mergeNestedTheme(React.useContext(ThemeContext), name),
    propTheme,
  ])

export let ThemeConsumer = ({ name, children, theme }) => {
  let newTheme = useTheme(name, theme)
  return <ThemeProvider value={newTheme}>{children(newTheme)}</ThemeProvider>
}

export let withNamedTheme = name => Component => {
  let themed = ({ theme, ...props }) => {
    let newTheme = useTheme(name, theme)
    return (
      <ThemeProvider value={newTheme}>
        <Component {...props} theme={newTheme} />
      </ThemeProvider>
    )
  }
  themed.displayName = `WithTheme${name ? `("${name}")` : ''}(${getDisplayName(
    Component
  )})`
  return themed
}

export let withTheme = withNamedTheme()
