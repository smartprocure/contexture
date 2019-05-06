import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Fonts, GVStyle } from './../../src/themes/greyVest'

storiesOf('Non Search Components|Grey Vest', module).addWithJSX('Box', () => (
  <div>
    <Fonts />
    <GVStyle />
    <Box>Box Contents</Box>
  </div>
))
