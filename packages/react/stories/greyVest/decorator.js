import React from 'react'
import theme, { Fonts, GVStyle } from '../../src/themes/greyVest'
import { ThemeProvider } from '../../src/utils/theme'

export default Story => (
  <div className="gv-body">
    <Fonts />
    <link
      href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
      rel="stylesheet"
    />
    <GVStyle />
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  </div>
)
