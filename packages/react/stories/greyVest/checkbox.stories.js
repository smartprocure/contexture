import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from '../../src/greyVest'

storiesOf('Components|GreyVest', module).addWithJSX('Checkbox', () => (
  <>
    <div>
      Unchecked:
      <Checkbox />
    </div>
    <div>
      Checked:
      <Checkbox checked />
    </div>
  </>
))
