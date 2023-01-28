import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from '../exampleTypes/stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import TagsQuerySearchBar from '../exampleTypes/TagsQuerySearchBar.js'

storiesOf('ExampleTypes|TagsQuerySearchBar', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('TagsQuerySearchBar', () => (
    <TagsQuerySearchBar tree={TestTree()} path={['tagsQuery']} />
  ))
