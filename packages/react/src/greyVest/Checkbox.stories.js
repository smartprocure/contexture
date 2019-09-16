import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .add('Checkbox', () => (
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
