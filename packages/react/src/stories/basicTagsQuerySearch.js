import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import TagsQuerySearchBar from './TagsQuerySearchBar'

storiesOf('ExampleTypes|TagsQuerySearchBar', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('TagsQuerySearchBar', () => (
    <TagsQuerySearchBar tree={TestTree()} path={['tagsQuery']} />
  ))