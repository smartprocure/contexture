import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { applyDefaults } from './utils/schema'
import { useTheme } from './utils/theme'
import ThemePicker from './stories/themePicker'
import { FilterAdder } from '.'

let mockTree = {
  add: action('add'),
  // if falsey, withNode assumes an error
  getNode: () => true,
}

storiesOf('Components|Search Components/FilterAdder', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('With ModalPicker', () => (
    <FilterAdder
      tree={mockTree}
      path={['path']}
      fields={applyDefaults({
        directors: {
          typeDefault: 'facet',
        },
        runtimeMinutes: {
          typeDefault: 'number',
        },
      })}
    />
  ))
  .addWithJSX('With Select', () => {
    let theme = useTheme()
    return (
      <div>
        <FilterAdder
          Picker={theme.Select}
          tree={mockTree}
          path={['path']}
          fields={applyDefaults({
            directors: {
              typeDefault: 'facet',
            },
            runtimeMinutes: {
              typeDefault: 'number',
            },
          })}
        />
        <div>Check action log to see adding being dispatched</div>
      </div>
    )
  })
  .addWithJSX('With NestedPicker', () => {
    let theme = useTheme()
    return (
      <div>
        <FilterAdder
          Picker={theme.NestedPicker}
          tree={mockTree}
          path={['path']}
          fields={applyDefaults({
            directors: {
              typeDefault: 'facet',
            },
            runtimeMinutes: {
              typeDefault: 'number',
            },
          })}
        />
        <div>Check action log to see adding being dispatched</div>
      </div>
    )
  })
