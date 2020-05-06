import React from 'react'
import _ from 'lodash/fp'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Bool } from '.'

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
