import React from 'react'
import { storiesOf } from '@storybook/react'
import { root, DnDDecorator } from './stories/util'
import Rule from './Rule'

storiesOf('Components|Search Components/QueryBuilder/Internals', module)
  .addDecorator(DnDDecorator)
  .add('Rule', () => (
    <Rule
      node={{
        type: 'test',
        key: 'testKey',
      }}
      tree={{
        join: 'and',
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
  ))
