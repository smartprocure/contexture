import React from 'react'
import { action } from '@storybook/addon-actions'
import { LinkButton } from '.'
import decorator from './stories/decorator'

let click = action('clicked')

export default {
  title: 'GreyVest Library|LinkButton',
  component: LinkButton,
  decorators: [decorator],
}

export let story = () => <LinkButton onClick={() => click()}>Click</LinkButton>
