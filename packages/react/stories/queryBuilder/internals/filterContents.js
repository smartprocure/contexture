import React from 'react'
import { storiesOf } from '@storybook/react'
import FilterContents from '../../../src/queryBuilder/FilterContents'

export default (parent, root) =>
  storiesOf('QueryBuilder/Internals/FilterContents', module).add(
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
            typeOptions: ['test']
          }
        }}
      />
    )
  )
