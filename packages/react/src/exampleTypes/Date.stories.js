import TestTree from './stories/testTree.js'
import Component from './Date.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['date'],
  },
}

export const Date = {}
