import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { Date } from './index.js'

storiesOf('ExampleTypes|Date', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Date', () => <Date tree={TestTree()} path={['date']} />)
