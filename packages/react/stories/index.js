import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import { Button } from '../src/index'

import readme from '../README.md'

storiesOf('Docs', module).add(
  'README.md',
  withInfo({
    text: readme,
    inline: true,
    source: false,
  })(() => null)
)

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))
