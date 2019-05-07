import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Fonts, GVStyle } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Box', module).addWithJSX('Default', () => (
  <div>
    <Fonts />
    <GVStyle />
    <Box>Box Contents</Box>
  </div>
))
