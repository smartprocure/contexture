import { parent, root } from './stories/util.js'
import Component from './OperatorMenu.js'

export default {
  component: Component,
  args: {
    node: { join: 'and' },
    parent,
    root,
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

export const OperatorMenu = {}
