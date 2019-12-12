import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Query } from '.'

storiesOf('ExampleTypes|Query', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Query', () => <Query tree={TestTree()} path={['query']} />)
