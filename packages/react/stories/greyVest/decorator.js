import React from 'react'
import { Fonts, GVStyle } from './../../src/themes/greyVest'

export default Story => (
  <div className="gv-body">
    <Fonts />
    <GVStyle />
    <Story />
  </div>
)
