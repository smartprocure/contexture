import { root } from './stories/util.js'
import Component from './FilterContents.js'

export default {
  component: Component,
}

export const FilterContents = {
  args: {
    node: { key: 'testKey' },
    root,
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['test'],
      },
    },
  },
}
