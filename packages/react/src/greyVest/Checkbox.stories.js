import React from 'react'
import { Checkbox } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest|Checkbox',
  decorators: [decorator],
  component: Checkbox,
  parameters: {
    componentSubtitle: 'Handy status label',
    notes: 'test',
    props: Checkbox.info.props,
  },
}

export let unchecked = () => <Checkbox />
export let checked = () => <Checkbox checked />
