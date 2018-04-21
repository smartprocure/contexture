import React from 'react'
import { storiesOf } from '@storybook/react'
import { observable } from 'mobx'
import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../../src/utils/contexture-mobx'
import QueryBuilder from '../../src/queryBuilder/'
import ExampleTypes from '../../src/exampleTypes/'
import { Input } from '../DemoControls'
let { TypeMap } = ExampleTypes({ Input })

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

let Node = (type, key) => observable({ key, type })

export default () =>
  storiesOf('QueryBuilder/Examples', module)
    .addWithJSX('One Filter', () => (
      <QueryBuilder
        tree={Client({
          key: 'root',
          join: 'and',
          children: [{ key: 'filter 1', type: 'query' }],
        })}
        path={['root']}
        types={TypeMap}
      />
    ))
    .addWithJSX('One Filter with fields', () => (
      <QueryBuilder
        path={['root']}
        tree={Client({
          key: 'root',
          join: 'and',
          children: [{ key: 'filter 1', field: 'test', type: 'query' }],
        })}
        fields={{
          test: {
            field: 'test',
            label: 'Test',
            typeOptions: ['facet', 'query'],
          },
          test2: {
            field: 'test2',
            label: 'Test2',
            typeOptions: ['facet', 'query'],
          },
        }}
        types={TypeMap}
      />
    ))
    .addWithJSX('One Filter with facet options', () => (
      <QueryBuilder
        path={['root']}
        tree={Client({
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'filter 1',
              type: 'facet',
              context: {
                options: [
                  {
                    name: 'Option 1',
                    count: 2,
                  },
                  {
                    name: 'Option 2',
                    count: 1,
                  },
                ],
              },
            },
          ],
        })}
        fields={['field1', 'field2', { label: 'Field 3', value: 'field3' }]}
        types={TypeMap}
      />
    ))
    .addWithJSX('One Filter on a misplaced root', () => (
      <QueryBuilder
        tree={Client({
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'search',
              join: 'and',
              children: [{ key: 'filter 1', type: 'query' }],
            },
          ],
        })}
        path={['root', 'search']}
        types={TypeMap}
      />
    ))
    .addWithJSX('Multiple Filters', () => (
      <QueryBuilder
        path={['root']}
        tree={Client({
          key: 'root',
          join: 'and',
          children: [
            Node('query', 'filter 1'),
            {
              key: 'group1',
              join: 'or',
              children: [
                Node('query', 'filter 2a'),
                Node('query', 'filter 2b'),
                {
                  key: 'group2',
                  join: 'and',
                  children: [
                    Node('facet', 'filter 4a'),
                    Node('query', 'filter 4b'),
                  ],
                },
              ],
            },
            Node('query', 'filter 3'),
            {
              key: 'group2',
              join: 'not',
              children: [
                Node('number', 'filter 5a'),
                Node('query', 'filter 5b'),
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
                    Node('query', 'filter 4a'),
                    Node('text', 'txt filter 4b'),
                  ],
                },
                Node('query', 'asdf'),
              ],
            },
          ],
        })}
        types={TypeMap}
      />
    ))
