import React from 'react'
import { storiesOf } from '@storybook/react'
import Rule from '../../../src/queryBuilder/Rule'

export default (parent, root, DnDDecorator) =>
  storiesOf('QueryBuilder/Internals/Rule', module)
    .addDecorator(DnDDecorator)
    .add('index', () => (
      <Rule
        node={{
          type: 'test',
          key: 'testKey',
        }}
        tree={{
          join: 'and',
        }}
        root={root}
      />
    ))
