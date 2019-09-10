import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Box', () => <Box>Box Contents</Box>)
