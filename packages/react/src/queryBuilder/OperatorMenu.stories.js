import { parent } from './stories/util.js'
import Component from './OperatorMenu.js'

export default {
  component: Component,
  args: {
    node: { join: 'and' },
    parent,
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

export const OperatorMenu = {}
