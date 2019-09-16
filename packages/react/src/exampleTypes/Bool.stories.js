import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Bool } from '.'

storiesOf('Components|ExampleTypes', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Bool', () => <Bool tree={TestTree()} path={['bool']} />)
