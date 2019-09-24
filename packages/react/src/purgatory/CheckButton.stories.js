import React from 'react'
import { storiesOf } from '@storybook/react'
import { CheckButton } from '.'
import ThemePicker from '../stories/themePicker'

storiesOf('Search Components|Internals/Checkbutton', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Unchecked', () => (
    <CheckButton>Your refrigerator is running</CheckButton>
  ))
  .add('Checked', () => (
    <CheckButton checked>Your refrigerator is running</CheckButton>
  ))
