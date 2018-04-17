import React from 'react'
import * as F from 'futil-js'
import {storiesOf} from '@storybook/react'
import {FilterList} from '../src/FilterList'

export default () => {
  storiesOf('FilterList', module).add('Example', () => {
    return (
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
          a: {label: 'Field A'},
          b: {label: 'B Field'},
        }}
        typeComponents={{
          typeA: () => <div>A TYPE</div>,
          typeB: () => <div>B TYPE</div>,
        }}
      />
    )
  })
}
