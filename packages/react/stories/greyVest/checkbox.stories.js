import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Checkbox } from '../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Checkbox', module)
  .addDecorator(decorator)
  .addWithJSX('Checkbox', () => (<><div>Unchecked:<Checkbox/></div><div>Checked:<Checkbox checked/></div></>))
