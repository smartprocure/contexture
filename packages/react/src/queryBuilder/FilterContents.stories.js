import Component from './FilterContents.js'

export default {
  component: Component,
}

export const FilterContents = {
  args: {
    node: { key: 'testKey' },
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['test'],
      },
    },
  },
}
