import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { mergeOrReturn } from './futil'

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

export let ThemeConsumer = ({ name, children, theme: propTheme }) => {
  let contextTheme = mergeNestedTheme(React.useContext(ThemeContext), name)
  let newTheme = mergeOrReturn(contextTheme, propTheme)
  return (
    <ThemeContext.Provider value={newTheme}>
      {children(newTheme)}
    </ThemeContext.Provider>
  )
}

export let withTheme = name => Component => ({ theme, ...props }) => (
  <ThemeConsumer {...{ theme, name }}>
    {newTheme => <Component {...props} theme={newTheme} />}
  </ThemeConsumer>
)
