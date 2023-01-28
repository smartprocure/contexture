import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NestedPicker } from './index.js'
import decorator from './stories/decorator.js'
import { options } from '../utils/stories.js'

storiesOf('GreyVest Library|NestedPicker', module)
  .addDecorator(decorator)
  .add('story', () => (
    <NestedPicker options={options} onChange={action(`picked`)} />
  ))
