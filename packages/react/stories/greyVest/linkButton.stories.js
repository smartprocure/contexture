import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LinkButton } from './../../src/greyVest'
import decorator from './decorator'

let click = action('clicked')

storiesOf('Components|GreyVest library', module)
  .addDecorator(decorator)
  .addWithJSX('LinkButton', () => (
    <LinkButton onClick={() => click()}>Click</LinkButton>
  ))
