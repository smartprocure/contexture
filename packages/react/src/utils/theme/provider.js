import React from 'react'
import ThemeContext from './context.js'
import { greyVest } from '../../themes/index.js'

export let ThemeProvider = ({ theme, children }) => {
  theme = { ...greyVest, ...theme }
  let Root = theme.Root || React.Fragment
  return (
    <ThemeContext.Provider value={theme}>
      <Root>{children}</Root>
    </ThemeContext.Provider>
  )
}
