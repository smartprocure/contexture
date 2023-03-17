import React from 'react'
import { componentForType } from './utils/schema.js'
import Component from './FilterList.js'

export default {
  component: Component,
}

export const FilterList = {
  args: {
    node: {
      children: [
        {
          field: 'a',
          type: 'typeA',
          path: ['a', 'a'],
        },
        {
          field: 'b',
          type: 'typeB',
          path: ['a', 'b'],
        },
        {
          field: 'c',
          type: 'typeB',
          path: ['a', 'c'],
        },
      ],
    },
    fields: {
      a: { label: 'Field A' },
      b: { label: 'B Field' },
      c: { label: 'c' },
    },
    tree: {},
    mapNodeToProps: componentForType({
      typeA: () => <div>A TYPE</div>,
      typeB: () => <div>B TYPE</div>,
    }),
  },
}
