import TestTree from './stories/testTree.js'
import Component from './Query.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['query'],
  },
}

export const Query = {}
