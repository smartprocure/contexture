import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ThemePicker from '../stories/themePicker'
import { ToggleFiltersButton } from '.'

let click = action('clicked')

storiesOf('Search Components|Internals/ToggleFiltersButton', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Story', () => (
    <ToggleFiltersButton onClick={() => click()} />
  ))
