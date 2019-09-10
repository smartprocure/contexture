import React from 'react'
import { storiesOf } from '@storybook/react'
import { CheckButton } from '../../src/purgatory'
import ThemePicker from '../themePicker'

storiesOf('Components|Search Components/Internals/Checkbutton', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Unchecked', () => (
    <CheckButton>Your refrigerator is running</CheckButton>
  ))
  .addWithJSX('Checked', () => (
    <CheckButton checked>Your refrigerator is running</CheckButton>
  ))
