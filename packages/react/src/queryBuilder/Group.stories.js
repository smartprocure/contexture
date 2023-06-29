import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../utils/contexture-mobx.js'
import { DnDDecorator } from './stories/util.js'
import Component from './Group.js'

export default {
  component: Component,
  decorators: [DnDDecorator],
  args: {
    isRoot: true,
    adding: [false],
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

const tree = Client({
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
    {
      key: 'oneFilter',
      join: 'or',
      children: [
        {
          key: 'asdf',
          typ: 'query',
        },
      ],
    },
  ],
})

export const OneFilter = {
  args: {
    tree,
    node: tree.getNode(['root', 'oneFilter']),
  },
}

export const MultipleFilters = {
  args: {
    tree,
    node: tree.getNode(['root']),
  },
}
