import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { Query } from './index.js'

storiesOf('ExampleTypes|Query', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Query', () => <Query tree={TestTree()} path={['query']} />)
