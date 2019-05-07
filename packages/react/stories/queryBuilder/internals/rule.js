import React from 'react'
import { storiesOf } from '@storybook/react'
import Rule from '../../../src/queryBuilder/Rule'
import { Provider } from 'mobx-react'

export default (parent, root, DnDDecorator) =>
  storiesOf('Search Components (Unthemed)|QueryBuilder/Internals/Rule', module)
    .addDecorator(DnDDecorator)
    .addWithJSX('index', () => (
      <Provider
        fields={{
          test: {
            field: 'test',
            label: 'Test',
            typeOptions: ['test'],
          },
        }}
      >
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
      </Provider>
    ))
