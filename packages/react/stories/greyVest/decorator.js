import React from 'react'
import { Fonts, GVStyle } from './../../src/themes/greyVest'

export default Story => (
  <div className="gv-body">
    <Fonts />
    <link
      href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
      rel="stylesheet"
    />
    <GVStyle />
    <Story />
  </div>
)
