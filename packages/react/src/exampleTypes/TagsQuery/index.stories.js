import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from '../stories/testTree'
import ThemePicker from '../../stories/themePicker'
import { TagsQuery } from '..'

let tags = _.map(n => ({ word: `(${n}) This is a tag` }), _.range(1, 5))

let treeWithTags = TestTree(testTree => {
  testTree.getNode(['tagsQuery']).tags = tags
  return testTree
})

storiesOf('ExampleTypes|Tags Query', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Default', () => <TagsQuery tree={treeWithTags} path={['tagsQuery']} />)
  .add('Responsive', () => (
    <div style={{ maxWidth: 500 }}>
      <TagsQuery tree={treeWithTags} path={['tagsQuery']} />
    </div>
  ))
