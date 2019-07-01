import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { CheckButton } from '../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Checkbutton', module)
  .addDecorator(decorator)
  .addWithJSX('Unchecked', () => (<CheckButton>Your refrigerator is running</CheckButton>))
  .addWithJSX('Checked', () => (<CheckButton checked>Your refrigerator is running</CheckButton>))
