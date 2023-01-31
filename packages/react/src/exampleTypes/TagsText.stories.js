import TestTree from './stories/testTree.js'
import Component from './TagsText.js'

export default {
  component: Component,
  args: {
    tree: TestTree((testTree) => {
      testTree.getNode(['tagsText']).values = ['this is a tag']
      return testTree
    }),
    path: ['tagsText'],
  },
}

export const TagsText = {}
