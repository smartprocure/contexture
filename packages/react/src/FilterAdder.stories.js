import { action } from '@storybook/addon-actions'
import Component from './FilterAdder.js'
import { Select, NestedPicker } from './greyVest/index.js'
import { options } from './utils/stories.js'

export default {
  component: Component,
  args: {
    path: ['path'],
    fields: options,
    tree: {
      add: action('add'),
      // if falsey, withNode assumes an error
      getNode: () => true,
    },
  },
}

export const WithModalPicker = {}

export const WithSelect = { args: { Picker: Select } }

export const WithNestedPicker = { args: { Picker: NestedPicker } }
