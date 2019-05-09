import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import decorator from './decorator'
import { Button } from './../../src/themes/greyVest'

storiesOf('Non Search Components|Grey Vest/Button', module)
  .addDecorator(decorator)
  .addWithJSX('Basic Usage', () => (
    <Button onClick={() => action('clicked')()}>Click</Button>
  ))
  .addWithJSX('Active', () => (
    <Button isActive onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
  .addWithJSX('Primary', () => (
    <Button primary onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
  .addWithJSX('As Div', () => (
    <Button as="div" onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
