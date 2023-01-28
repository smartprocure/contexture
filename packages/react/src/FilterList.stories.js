import React from 'react'
import { storiesOf } from '@storybook/react'
import { componentForType } from './utils/schema.js'
import ThemePicker from './stories/themePicker.js'
import { FilterList } from './index.js'

storiesOf('Search Components|FilterList', module)
  .addDecorator(ThemePicker('blueberry'))
  .add('FilterList', () => (
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
      tree={{}}
      mapNodeToProps={componentForType({
        typeA: () => <div>A TYPE</div>,
        typeB: () => <div>B TYPE</div>,
      })}
    />
  ))
