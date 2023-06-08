import { action } from '@storybook/addon-actions'
import Component from './LinkButton.js'

export default {
  component: Component,
  args: {
    onClick: () => action('clicked'),
    args: { children: 'Link Button' },
  },
}

export let LinkButton = {}
