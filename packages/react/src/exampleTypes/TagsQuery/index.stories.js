import React from 'react'
import _ from 'lodash/fp.js'
import TestTree from '../stories/testTree.js'
import Component from './index.js'

let tags = [
  { word: 'janitor', distance: 3 },
  { word: 'soap', distance: 3 },
  { word: 'cleaner', distance: 3 },
  { word: 'cleaning', distance: 3 },
  { word: 'clean', distance: 3 },
]

let keywords = _.map(
  (n) => ({ word: `(${n}) test keyword`, distance: 3 }),
  _.range(1, 5)
)

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
