import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button, Fonts, GVStyle } from './../../src/themes/greyVest'

storiesOf('Non Search Components|Grey Vest/Button', module)
  .addWithJSX('Basic Usage', () => (
    <div>
      <Fonts />
      <GVStyle />
      <Button onClick={() => action('clicked')()}>Click</Button>
    </div>
  ))
  .addWithJSX('Active', () => (
    <div>
      <Fonts />
      <GVStyle />
      <Button isActive onClick={() => action('clicked')()}>
        Click
      </Button>
    </div>
  ))
  .addWithJSX('Primary', () => (
    <div>
      <Fonts />
      <GVStyle />
      <Button primary onClick={() => action('clicked')()}>
        Click
      </Button>
    </div>
  ))
  .addWithJSX('As Div', () => (
    <div>
      <Fonts />
      <GVStyle />
      <Button as="div" onClick={() => action('clicked')()}>
        Click
      </Button>
    </div>
  ))
