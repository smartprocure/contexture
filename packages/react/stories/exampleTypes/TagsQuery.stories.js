import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from '../testTree'
import { ExampleTypes } from '../DemoControls'
let { TagsQuery } = ExampleTypes

let tags = _.map(n => ({ word: `(${n}) This is a tag` }), _.range(1, 5))

let treeWithTags = TestTree(testTree => {
  testTree.getNode(['tagsQuery']).tags = tags
  return testTree
})

storiesOf('Search Components (Unthemed)|Example Types/Tags Query', module)
  .addWithJSX('Default', () => (
    <TagsQuery tree={treeWithTags} path={['tagsQuery']} />
  ))
  .addWithJSX('Responsive', () => (
    <div style={{ maxWidth: 500 }}>
      <TagsQuery tree={treeWithTags} path={['tagsQuery']} />
    </div>
  ))
