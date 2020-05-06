import React from 'react'
import _ from 'lodash/fp'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Exists } from '.'

storiesOf('ExampleTypes|Exists', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Exists', () => <Exists tree={TestTree()} path={['exists']} />)
  .add('Exists Customized', () => (
    <Exists
      tree={TestTree()}
      path={['exists']}
      display={value => _.isNil(value) ? 'Both' : value ? 'There' : 'Not there'}
    />
  ))
