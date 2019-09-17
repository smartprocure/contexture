import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ThemePicker from '../stories/themePicker'
import { ToggleFiltersButton } from '.'

let click = action('clicked')

storiesOf('Components|Search Components/Internals', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('ToggleFiltersButton', () => (
    <ToggleFiltersButton onClick={() => click()} />
  ))
