import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Bool } from '.'

storiesOf('ExampleTypes|Bool', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Bool', () => <Bool tree={TestTree()} path={['bool']} />)
  .add('Bool Customized', () => (
    <Bool tree={TestTree()} path={['bool']} display={() => ['Agree', 'Disagree']} />
  ))
