import React from 'react'
import _ from 'lodash/fp.js'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { Bool } from './index.js'

storiesOf('ExampleTypes|Bool', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Bool', () => <Bool tree={TestTree()} path={['bool']} />)
  .add('Bool Custom Options', () => (
    <Bool
      tree={TestTree()}
      path={['bool']}
      display={value =>
        _.isNil(value) ? 'Both' : value ? 'Agree' : 'Disagree'
      }
    />
  ))
