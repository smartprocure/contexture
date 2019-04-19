import React from 'react'
import { storiesOf } from '@storybook/react'
import { FilterList } from '../src/FilterList'

storiesOf('FilterList', module).addWithJSX('Example', () => (
  <FilterList
    node={{
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
    }}
    fields={{
      a: { label: 'Field A' },
      b: { label: 'B Field' },
      c: { label: 'c' },
    }}
    typeComponents={{
      typeA: () => <div>A TYPE</div>,
      typeB: () => <div>B TYPE</div>,
    }}
  />
))
