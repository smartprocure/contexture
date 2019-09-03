import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from '../greyVest/decorator'
import { CheckButton } from '../../src/purgatory'

storiesOf('Components (Purgatory)|Checkbutton', module)
  .addDecorator(decorator)
  .addWithJSX('Unchecked', () => (
    <CheckButton>Your refrigerator is running</CheckButton>
  ))
  .addWithJSX('Checked', () => (
    <CheckButton checked>Your refrigerator is running</CheckButton>
  ))
