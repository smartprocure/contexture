import React from 'react'
import _ from 'lodash/fp'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FilterAdder from '../../src/FilterAdder'
import { applyDefaults } from '../../src/utils/schema'
import { defaultProps } from 'recompose'

let Select = ({ options, onChange }) => (
  <select onChange={e => onChange(e.target.value)}>
    {_.map(
      x => (
        <option value={x.value} key={x.value}>
          {x.label}
        </option>
      ),
      options
    )}
  </select>
)

let Adder = defaultProps({ label: '+ Include Additional Filter' })(FilterAdder)

let mockTree = {
  add: action('add'),
  // if falsey, withNode assumes an error
  getNode: () => true,
}

storiesOf('Components|Search components/FilterAdder', module)
  .addWithJSX('Example', () => (
    <div>
      <FilterAdder
        Picker={Select}
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
  ))
  .addWithJSX('With NestedPickerModal', () => (
    <Adder
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
