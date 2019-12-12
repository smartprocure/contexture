import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Number } from '.'

storiesOf('ExampleTypes|Number', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Number', () => <Number tree={TestTree()} path={['number']} />)
