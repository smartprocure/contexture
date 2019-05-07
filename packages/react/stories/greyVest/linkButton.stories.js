import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import decorator from './decorator'
import { LinkButton } from './../../src/themes/greyVest'

let click = action('clicked')

storiesOf('Non Search Components|Grey Vest', module)
  .addDecorator(decorator)
  .addWithJSX('LinkButton', () =>
    <LinkButton onClick={() => click()}>Click</LinkButton>
  )
