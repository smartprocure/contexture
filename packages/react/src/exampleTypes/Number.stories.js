import TestTree from './stories/testTree.js'
import Component from './Number.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['number'],
  },
}

export const Number = {}
