import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NestedPicker } from '.'
import decorator from './stories/decorator'

storiesOf('GreyVest Library|NestedPicker', module)
  .addDecorator(decorator)
  .add('story', () => (
    <NestedPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action(`picked`)}
    />
  ))
