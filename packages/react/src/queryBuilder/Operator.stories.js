import { parent, root, DnDDecorator } from './stories/util.js'
import Component from './Operator.js'

export default {
  component: Component,
  decorators: [DnDDecorator],
  args: {
    index: 1,
    root,
    parent,
    noDrop: true,
    child: { join: 'and' },
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

export const And = { args: { node: { join: 'and' } } }

export const Or = { args: { node: { join: 'or' } } }

export const Not = { args: { node: { join: 'not' } } }

export const FirstAnd = { args: { index: 0, node: { join: 'and' } } }

export const FirstOr = { args: { index: 0, node: { join: 'or' } } }

export const FirstNot = { args: { index: 0, node: { join: 'not' } } }
