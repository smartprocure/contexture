import React from 'react'
import { Checkbox } from './index.js'
import decorator from './stories/decorator.js'

export default {
  title: 'GreyVest Library|Checkbox',
  decorators: [decorator],
  component: Checkbox,
  parameters: {
    componentSubtitle: 'Handy status label',
    notes: 'test',
  },
}

export let unchecked = () => <Checkbox />
export let checked = () => <Checkbox checked />
