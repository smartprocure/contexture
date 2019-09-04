import React from 'react'
import { storiesOf } from '@storybook/react'
import { CheckButton } from '../../src/purgatory'

storiesOf('Components|Search components/Checkbutton', module)
  .addWithJSX('Unchecked', () => (
    <CheckButton>Your refrigerator is running</CheckButton>
  ))
  .addWithJSX('Checked', () => (
    <CheckButton checked>Your refrigerator is running</CheckButton>
  ))
