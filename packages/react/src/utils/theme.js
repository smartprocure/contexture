import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { mergeOrReturn } from './futil'
import { getDisplayName } from './hoc'

let ThemeContext = React.createContext({})
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

let mergeThemes = (name, propTheme) => {
  let contextTheme = mergeNestedTheme(React.useContext(ThemeContext), name)
  return mergeOrReturn(contextTheme, propTheme)
}

export let ThemeConsumer = ({ name, children, theme }) => {
  let newTheme = mergeThemes(name, theme)
  return <ThemeProvider value={newTheme}>{children(newTheme)}</ThemeProvider>
}

export let withTheme = name => Component => {
  let themed = ({ theme, ...props }) => {
    let newTheme = mergeThemes(name, theme)
    return (
      <ThemeProvider value={newTheme}>
        <Component {...props} theme={newTheme} />
      </ThemeProvider>
    )
  }
  themed.displayName = `WithTheme("${name}")(${getDisplayName(Component)})`
  return themed
}
