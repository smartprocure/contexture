import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from '../testTree'
import { TagsQuery } from '../../src/exampleTypes'
import ThemePicker from '../themePicker'

let tags = _.map(n => ({ word: `(${n}) This is a tag` }), _.range(1, 5))

let treeWithTags = TestTree(testTree => {
  testTree.getNode(['tagsQuery']).tags = tags
  return testTree
})

storiesOf('Components|Search components/ExampleTypes/Tags Query', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Default', () => (
    <TagsQuery tree={treeWithTags} path={['tagsQuery']} />
  ))
  .addWithJSX('Responsive', () => (
    <div style={{ maxWidth: 500 }}>
      <TagsQuery tree={treeWithTags} path={['tagsQuery']} />
    </div>
  ))
