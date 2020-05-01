import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Exists } from '.'

storiesOf('ExampleTypes|Exists', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Exists', () => <Exists tree={TestTree()} path={['exists']} />)
  .add('Exists Customized', () => (
    <Exists tree={TestTree()} path={['exists']} options={['Foo', 'Boo']} />
  ))
