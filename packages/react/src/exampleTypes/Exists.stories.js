import React from 'react'
import _ from 'lodash/fp.js'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { Exists } from './index.js'

storiesOf('ExampleTypes|Exists', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Exists', () => <Exists tree={TestTree()} path={['exists']} />)
  .add('Exists Customized', () => (
    <Exists
      tree={TestTree()}
      path={['exists']}
      display={(value) =>
        _.isNil(value) ? 'Both' : value ? 'There' : 'Not there'
      }
    />
  ))
