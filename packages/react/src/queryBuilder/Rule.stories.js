import { root, DnDDecorator } from './stories/util.js'
import Component from './Rule.js'

export default {
  component: Component,
  decorators: [DnDDecorator],
  args: {
    root,
    node: { type: 'test', key: 'testKey' },
    tree: { join: 'and' },
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['test'],
      },
    },
  },
}

export const Rule = {}
