import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ToggleFiltersButton } from '../../src/purgatory'

let click = action('clicked')

storiesOf('Components|GreyVest library', module).addWithJSX(
  'ToggleFiltersButton',
  () => <ToggleFiltersButton onClick={() => click()} />
)
