import { root, DnDDecorator } from './stories/util.js'
import Component from './Group.js'

export default {
  component: Component,
  decorators: [DnDDecorator],
  args: {
    root,
    isRoot: true,
    adding: [false],
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

export const OneFilter = {
  args: {
    node: {
      key: 'root',
      join: 'and',
      children: [{ key: 'filter 1', type: 'query' }],
    },
  },
}

export const MultipleFilters = {
  args: {
    node: {
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
    },
  },
}
