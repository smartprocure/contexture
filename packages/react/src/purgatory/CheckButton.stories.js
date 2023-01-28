import React from 'react'
import { storiesOf } from '@storybook/react'
import { CheckButton } from './index.js'
import ThemePicker from '../stories/themePicker.js'

storiesOf('Search Components|Internals/Checkbutton', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Unchecked', () => (
    <CheckButton>Your refrigerator is running</CheckButton>
  ))
  .add('Checked', () => (
    <CheckButton checked>Your refrigerator is running</CheckButton>
  ))
