import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LinkButton } from '.'
import decorator from './stories/decorator'

let click = action('clicked')

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('LinkButton', () => (
    <LinkButton onClick={() => click()}>Click</LinkButton>
  ))
