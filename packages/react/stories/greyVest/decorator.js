import React from 'react'
import { Fonts, GVStyle } from './../../src/themes/greyVest'

export default storyFn =>
  <div className="gv-body">
    <Fonts />
    <GVStyle />
    {storyFn()}
  </div>

