import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import decorator from './decorator'
import { LinkButton } from './../../src/themes/greyVest'

storiesOf('Non Search Components|Grey Vest', module)
  .addDecorator(decorator)
  .addWithJSX('LinkButton', () =>
    <LinkButton onClick={() => action('clicked')()}>Click</LinkButton>
  )
