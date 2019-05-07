import React from 'react'
import { Fonts, GVStyle } from './../../src/themes/greyVest'

export default storyFn =>
  <div>
    <Fonts />
    <GVStyle />
    {storyFn()}
  </div>

