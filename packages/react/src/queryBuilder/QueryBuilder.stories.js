import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../utils/contexture-mobx.js'
import { TypeMap } from '../exampleTypes/index.js'
import { componentForType } from '../utils/schema.js'
import Component from './QueryBuilder.js'

export default {
  component: Component,
  args: {
    path: ['root'],
    mapNodeToProps: componentForType(TypeMap),
  },
}

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

let Node = (type, key) => ({ key, type })

export const OneFilter = {
  args: {
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{ key: 'filter 1', type: 'query' }],
    }),
  },
}

export const OneFilterWithFields = {
  args: {
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{ key: 'filter 1', field: 'test', type: 'query' }],
    }),
    fields: {
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
    },
  },
}

export const OneFilterWithFacetOptions = {
  args: {
    tree: Client({
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
    }),
    fields: ['field1', 'field2', { label: 'Field 3', value: 'field3' }],
  },
}

export const OneFilterOnAMisplacedRoot = {
  args: {
    path: ['root', 'search'],
    tree: Client({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'search',
          join: 'and',
          children: [{ key: 'filter 1', type: 'query' }],
        },
      ],
    }),
  },
}

export const MultipleFilters = {
  args: {
    tree: Client({
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
    }),
  },
}
