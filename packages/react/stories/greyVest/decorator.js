import React from 'react'
import greyVest from '../../src/themes/greyVest'
import { ThemeProvider } from '../../src/utils/theme'

export default Story => (
  <ThemeProvider theme={greyVest}>
    <Story />
  </ThemeProvider>
)
