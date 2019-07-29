import React from 'react'
import { storiesOf } from '@storybook/react'
import Rule from '../../../src/queryBuilder/Rule'

export default (parent, root, DnDDecorator) =>
  storiesOf('Search Components (Unthemed)|QueryBuilder/Internals/Rule', module)
    .addDecorator(DnDDecorator)
    .addWithJSX('index', () => (
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
