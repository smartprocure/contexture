import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { Number } from './index.js'

storiesOf('ExampleTypes|Number', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Number', () => <Number tree={TestTree()} path={['number']} />)
