import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'

export let ThemeContext = React.createContext()

let hasNested = _.curry((key, theme) =>
  key && theme && F.findIndexed((v, k) => _.startsWith(`${key}.`, k), theme)
)

export let mergeNestedTheme = (theme, key) => 
F.when(
  hasNested(key),
  _.flow(
    _.pickBy((val, k) => _.startsWith(`${key}.`, k)),
    _.mapKeys(x => _.replace(`${key}.`, '', x)),
    _.defaults(theme)
  )
)(theme)

export let mergeNestedThemePath = (theme, path) => _.reduce(
  (acc, key) => mergeNestedTheme(acc, key),
  theme,
  path || []
)

export let ThemeConsumer = ({ children, path }) =>
  <ThemeContext.Consumer>
    {theme => children(mergeNestedThemePath(theme, path))}
  </ThemeContext.Consumer>

export let withTheme = name => Component => ({ theme: propTheme, ...props }) => {
  let contextTheme = mergeNestedTheme(React.useContext(ThemeContext), name)
  let newTheme = _.merge(contextTheme, propTheme)
  return (
    <ThemeContext.Provider value={newTheme}>
      <Component {...props} theme={newTheme} />
    </ThemeContext.Provider>
  )
}
