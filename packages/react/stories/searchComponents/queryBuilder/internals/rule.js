import React from 'react'
import { storiesOf } from '@storybook/react'
import Rule from '../../../../src/queryBuilder/Rule'

export default (parent, root, DnDDecorator) =>
  storiesOf('Components|Search components/QueryBuilder/Internals', module)
    .addDecorator(DnDDecorator)
    .addWithJSX('Rule', () => (
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
