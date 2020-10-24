import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import  TagsText  from './TagsText'



let treeWithValues = TestTree(testTree => {
  testTree.getNode(['tagsText']).values = ['this is a tag']
  return testTree
})


storiesOf('ExampleTypes|Tags Text', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('TagsText', () => <TagsText tree={treeWithValues} path={['tagsText']} />)

