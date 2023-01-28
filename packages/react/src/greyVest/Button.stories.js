import React from 'react'
import { action } from '@storybook/addon-actions'
import { Button } from './index.js'
import decorator from './stories/decorator.js'

export default {
  title: 'GreyVest Library|Button',
  component: Button,
  decorators: [decorator],
}

export let basicUsage = () => (
  <Button onClick={() => action('clicked')()}>Click</Button>
)

export let disabled = () => (
  <Button disabled onClick={() => action('clicked')()}>
    Do not click
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
    Cannot touch this
  </Button>
)

export let asDiv = () => (
  <Button as="div" onClick={() => action('clicked')()}>
    Click
  </Button>
)
