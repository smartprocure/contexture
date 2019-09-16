import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Date } from '.'

storiesOf('Components|ExampleTypes', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Date', () => <Date tree={TestTree()} path={['date']} />)
