import React from 'react'
import { action } from '@storybook/addon-actions'
import { Button } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest|Button',
  component: Button,
  decorators: [decorator],
}

export let basicUsage = () => (
  <Button onClick={() => action('clicked')()}>Click</Button>
)

export let disabled = () => (
  <Button disabled onClick={() => action('clicked')()}>
    Don't click
  </Button>
)

export let active = () => (
  <Button isActive onClick={() => action('clicked')()}>
    Click
  </Button>
)

export let primary = () => (
  <Button primary onClick={() => action('clicked')()}>
    Click
  </Button>
)

export let primaryDisabled = () => (
  <Button primary disabled onClick={() => action('clicked')()}>
    Can't touch this
  </Button>
)

export let asDiv = () => (
  <Button as="div" onClick={() => action('clicked')()}>
    Click
  </Button>
)
