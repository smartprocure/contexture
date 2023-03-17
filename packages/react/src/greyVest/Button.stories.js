import { action } from '@storybook/addon-actions'
import Component from './Button.js'

export default {
  component: Component,
  args: {
    children: 'Click',
    onClick: () => action('clicked'),
  },
}

export let Default = {}

export let Disabled = { args: { disabled: true } }

export let Active = { args: { isActive: true } }

export let Primary = { args: { primary: true } }

export let PrimaryDisabled = { args: { primary: true, disabled: true } }

export let AsDiv = { args: { as: 'div' } }
