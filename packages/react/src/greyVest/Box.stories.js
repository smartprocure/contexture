import React from 'react'
import { Box } from './index.js'
import decorator from './stories/decorator.js'

export default {
  title: 'GreyVest Library|Box',
  decorators: [decorator],
  component: Box,
  descriptionSlot: () => 'box description',
}

export let story = () => <Box>Box Contents</Box>
