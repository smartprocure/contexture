import React from 'react'
import { Box } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Box',
  decorators: [decorator],
  component: Box,
  descriptionSlot: () => 'box description',
}

export let story = () => <Box>Box Contents</Box>
