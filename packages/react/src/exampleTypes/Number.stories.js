import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Number } from '.'

storiesOf('Components|ExampleTypes', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Number', () => <Number tree={TestTree()} path={['number']} />)
