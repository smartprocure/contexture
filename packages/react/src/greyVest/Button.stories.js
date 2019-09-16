import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Button', module)
  .addDecorator(decorator)
  .add('Basic Usage', () => (
    <Button onClick={() => action('clicked')()}>Click</Button>
  ))
  .add('Disabled', () => (
    <Button disabled onClick={() => action('clicked')()}>
      Don't click
    </Button>
  ))
  .add('Active', () => (
    <Button isActive onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
  .add('Primary', () => (
    <Button primary onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
  .add('Primary Disabled', () => (
    <Button primary disabled onClick={() => action('clicked')()}>
      Can't touch this
    </Button>
  ))
  .add('As Div', () => (
    <Button as="div" onClick={() => action('clicked')()}>
      Click
    </Button>
  ))
