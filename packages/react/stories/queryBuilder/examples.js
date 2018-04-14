import React from 'react'
import { storiesOf } from '@storybook/react'
import { observable } from 'mobx'
import SearchRoot, { NewNode } from '../../src/queryBuilder/SearchRoot'
import Types from '../../src/queryBuilder/exampleTypes'

let Node = NewNode(Types)

export default () => storiesOf('QueryBuilder/Examples', module)
  .add('One Filter', () => (
    <SearchRoot
      tree={observable({
        key: 'root',
        join: 'and',
        children: [{ key: 'filter 1', type: 'query' }],
      })}
      types={Types}
    />
  ))
  .add('One Filter with fields', () => (
    <SearchRoot
      tree={observable({
        key: 'root',
        join: 'and',
        children: [{ key: 'filter 1', type: 'query' }],
      })}
      fields={['field1', 'field2', 'field3']}
      types={Types}
    />
  ))
  .add('One Filter with facet options', () => (
    <SearchRoot
      tree={observable({
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
      types={Types}
    />
  ))
  .add('One Filter on a misplaced root', () => (
    <SearchRoot
      tree={observable({
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
      types={Types}
    />
  ))
  .add('Multiple Filters', () => (
    <SearchRoot
      tree={observable({
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
            children: [Node('number', 'filter 5a'), Node('query', 'filter 5b')],
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
      types={Types}
    />
  ))
