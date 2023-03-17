import { action } from '@storybook/addon-actions'
import { options } from '../utils/stories.js'
import Component from './NestedPicker.js'

export default {
  component: Component,
  args: {
    options,
    onChange: () => action('picked'),
  },
}

export const NestedPicker = {}
