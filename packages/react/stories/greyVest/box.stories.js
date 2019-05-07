import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Box } from './../../src/themes/greyVest'

storiesOf('Non Search Components|Grey Vest', module)
  .addDecorator(decorator)
  .addWithJSX('Box', () => (
    <Box>Box Contents</Box>
  ))
