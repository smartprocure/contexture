import React from 'react'
import { Checkbox } from '.'
import decorator from './stories/decorator'
import F from 'futil-js'

let propDefGetter = type => F.unkeyBy('name', type.info.props)

export default {
  title: 'GreyVest|Checkbox',
  decorators: [decorator],
  component: Checkbox,
  parameters: {
    componentSubtitle: 'Handy status label',
    notes: 'test',
  },
}

export let unchecked = () => <Checkbox />
export let checked = () => <Checkbox checked />
