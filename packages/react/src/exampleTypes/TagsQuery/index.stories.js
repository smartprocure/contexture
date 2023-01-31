import React from 'react'
import _ from 'lodash/fp.js'
import TestTree from '../stories/testTree.js'
import Component from './index.js'

let tags = _.map((n) => ({ word: `(${n}) This is a tag` }), _.range(1, 5))

let treeWithTags = TestTree((testTree) => {
  testTree.getNode(['tagsQuery']).tags = tags
  return testTree
})

export default {
  component: Component,
  args: {
    tree: treeWithTags,
    path: ['tagsQuery'],
  },
}

export const Default = {}

export const Responsive = () => (
  <div style={{ maxWidth: 500 }}>
    <Component tree={treeWithTags} path={['tagsQuery']} />
  </div>
)
