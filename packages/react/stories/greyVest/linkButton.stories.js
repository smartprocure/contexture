import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LinkButton } from './../../src/greyVest'

let click = action('clicked')

storiesOf('Components|GreyVest library', module).addWithJSX(
  'LinkButton',
  () => <LinkButton onClick={() => click()}>Click</LinkButton>
)
