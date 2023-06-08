import TestTree from './stories/testTree.js'
import Component from './TagsQuerySearchBar.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['tagsQuery'],
  },
}

export const TagsQuerySearchBar = {}
