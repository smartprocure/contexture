import React from 'react'
import { storiesOf } from '@storybook/react'
import FilterContents from '../../../src/queryBuilder/FilterContents'

export default (parent, root) =>
  storiesOf('Search Components (Unthemed)|QueryBuilder/Internals/FilterContents', module).addWithJSX(
    'FilterContents',
    () => (
      <FilterContents
        node={{
          // type: 'test',
          key: 'testKey',
        }}
        root={root}
        fields={{
          test: {
            field: 'test',
            label: 'Test',
            typeOptions: ['test'],
          },
        }}
      />
    )
  )
