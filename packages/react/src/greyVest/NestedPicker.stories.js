import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NestedPicker } from '.'
import decorator from './stories/decorator'
import { options } from '../utils/stories'

storiesOf('GreyVest Library|NestedPicker', module)
  .addDecorator(decorator)
  .add('story', () => (
    <NestedPicker options={options} onChange={x => action(`picked`)(x)} />
  ))
