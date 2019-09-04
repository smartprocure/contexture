import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ToggleFiltersButton } from './../../src/greyVest'

let click = action('clicked')

storiesOf('Components (Grey Vest)|ToggleFiltersButton', module).addWithJSX(
  'Basic Usage',
  () => <ToggleFiltersButton onClick={() => click()} />
)
