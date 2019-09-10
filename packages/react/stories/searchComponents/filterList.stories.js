import React from 'react'
import { storiesOf } from '@storybook/react'
import { FilterList } from '../../src/FilterList'
import { componentForType } from '../../src'
import ThemePicker from '../themePicker'

storiesOf('Components|Search Components', module)
  .addDecorator(ThemePicker('blueberry'))
  .addWithJSX('FilterList', () => (
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
      mapNodeToProps={componentForType({
        typeA: () => <div>A TYPE</div>,
        typeB: () => <div>B TYPE</div>,
      })}
    />
  ))
