import React from 'react'
import theme from '../../src/themes/greyVest'
import { ThemeProvider } from '../../src/utils/theme'

export default Story => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
)
