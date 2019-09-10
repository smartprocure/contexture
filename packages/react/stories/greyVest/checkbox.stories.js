import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from '../../src/greyVest'
import decorator from './decorator'

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Checkbox', () => (
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
