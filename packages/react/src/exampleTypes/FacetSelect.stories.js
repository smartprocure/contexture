import TestTree from './stories/testTree.js'
import Component from './FacetSelect.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['facet'],
  },
}

export const FacetSelect = {}
