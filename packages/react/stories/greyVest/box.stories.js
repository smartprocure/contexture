import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Box } from './../../src/greyVest'

storiesOf('Components (Grey Vest)|Box', module)
  .addDecorator(decorator)
  .addWithJSX('Box', () => <Box>Box Contents</Box>)
