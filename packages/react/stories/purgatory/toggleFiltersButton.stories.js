import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ToggleFiltersButton } from '../../src/purgatory'
import ThemePicker from '../themePicker'

let click = action('clicked')

storiesOf('Components|Search components/Other components', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('ToggleFiltersButton', () => (
    <ToggleFiltersButton onClick={() => click()} />
  ))
