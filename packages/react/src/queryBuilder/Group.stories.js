import React from 'react'
import { storiesOf } from '@storybook/react'
import { root, DnDDecorator } from './stories/util'
import Group from './Group'

storiesOf('Search Components|QueryBuilder/Internals/Group', module)
  .addDecorator(DnDDecorator)
  .add('One Filter', () => (
    <Group
      node={{
        key: 'root',
        join: 'and',
        children: [{ key: 'filter 1', type: 'query' }],
      }}
      root={root}
      isRoot={true}
    />
  ))
  .add('Multiple Filters', () => (
    <Group
      node={{
        key: 'root',
        join: 'and',
        children: [
          { type: 'query', key: 'filter 1' },
          {
            key: 'group1',
            join: 'or',
            children: [
              { type: 'query', key: 'filter 2a' },
              { type: 'query', key: 'filter 2b' },
              {
                key: 'group2',
                join: 'and',
                children: [
                  {
                    key: 'filter 4a',
                    type: 'facet',
                  },
                  { type: 'query', key: 'filter 4b' },
                ],
              },
            ],
          },
          { type: 'query', key: 'filter 3' },
          {
            key: 'group2',
            join: 'not',
            children: [
              { key: 'filter 5a', type: 'number' },
              { type: 'query', key: 'filter 5b' },
            ],
          },
          {
            key: 'group24',
            join: 'or',
            children: [
              {
                key: 'group2',
                join: 'and',
                children: [
                  { type: 'query', key: 'filter 4a' },
                  { key: 'txt filter 4b', type: 'text' },
                ],
              },
              {
                key: 'asdf',
                typ: 'query',
              },
            ],
          },
        ],
      }}
      root={root}
      isRoot={true}
    />
  ))
