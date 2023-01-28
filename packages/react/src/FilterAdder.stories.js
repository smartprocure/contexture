import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { useTheme } from './utils/theme.js'
import ThemePicker from './stories/themePicker.js'
import { FilterAdder } from './index.js'
import { options } from './utils/stories.js'

let mockTree = {
  add: action('add'),
  // if falsey, withNode assumes an error
  getNode: () => true,
}

storiesOf('Search Components|FilterAdder', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('With ModalPicker', () => (
    <FilterAdder tree={mockTree} path={['path']} fields={options} />
  ))
  .add('With Select', () => {
    let theme = useTheme()
    return (
      <div>
        <FilterAdder
          Picker={theme.Select}
          tree={mockTree}
          path={['path']}
          fields={options}
        />
        <div style={{ marginTop: 20 }}>
          Check action log to see <b>onChange</b> being dispatched
        </div>
      </div>
    )
  })
  .add('With NestedPicker', () => {
    let theme = useTheme()
    return (
      <div>
        <FilterAdder
          Picker={theme.NestedPicker}
          tree={mockTree}
          path={['path']}
          fields={options}
        />
        <div style={{ marginTop: 20 }}>
          Check action log to see <b>onChange</b> being dispatched
        </div>
      </div>
    )
  })
