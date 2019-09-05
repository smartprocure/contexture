import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NestedPicker } from '../../src/greyVest'
import decorator from './decorator'

storiesOf('Components|GreyVest library', module)
  .addDecorator(decorator)
  .addWithJSX('NestedPicker', () => (
    <NestedPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action(`picked`)}
    />
  ))
