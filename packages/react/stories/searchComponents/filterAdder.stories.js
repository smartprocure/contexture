import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FilterAdder from '../../src/FilterAdder'
import { applyDefaults } from '../../src/utils/schema'
import { useTheme } from '../../src/utils/theme'
import ThemePicker from '../themePicker'

let mockTree = {
  add: action('add'),
  // if falsey, withNode assumes an error
  getNode: () => true,
}

storiesOf('Components|Search components/Other components/FilterAdder', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Example', () => {
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
  .addWithJSX('With NestedPickerModal', () => (
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
