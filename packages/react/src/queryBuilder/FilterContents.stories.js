import React from 'react'
import { storiesOf } from '@storybook/react'
import { root } from './stories/util'
import FilterContents from './FilterContents'

storiesOf('Components|Search Components/QueryBuilder/Internals', module).add(
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
