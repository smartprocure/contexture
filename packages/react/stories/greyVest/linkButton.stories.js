import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LinkButton, Fonts, GVStyle } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|LinkButton', module).addWithJSX(
  'Default',
  () => (
    <div>
      <Fonts />
      <GVStyle />
      <LinkButton onClick={() => action('clicked')()}>Click</LinkButton>
    </div>
  )
)
