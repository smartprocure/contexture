import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import decorator from './decorator'
import { Button } from './../../src/greyVest'

storiesOf('Components (Grey Vest)|Button', module)
  .addDecorator(decorator)
  .addWithJSX('Basic Usage', () => (
    <Button onClick={() => action('clicked')()}>Click</Button>
  ))
  .addWithJSX('Disabled', () => (
    <Button disabled onClick={() => action('clicked')()}>
      Don't click
    </Button>
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
  .addWithJSX('Primary Disabled', () => (
    <Button primary disabled onClick={() => action('clicked')()}>
      Can't touch this
    </Button>
  ))
  .addWithJSX('As Div', () => (
    <Button as="div" onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
