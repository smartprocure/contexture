import React from 'react'
import _ from 'lodash/fp'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FilterAdder from '../src/FilterAdder'
import { applyDefaults } from '../src/utils/schema'
import { defaultProps } from 'recompose'
import Modal from '../src/layout/Modal'
import { ModalPicker, NestedPicker } from '../src'

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

let Adder = defaultProps({
  Picker: defaultProps({
    Modal,
    label: '+ Include Additional Filter',
    Picker: NestedPicker,
  })(ModalPicker),
})(FilterAdder)

let mockTree = {
  add: action('add'),
  // if falsey, injectTreeNode assumes an error
  getNode: () => true,
}

storiesOf('Search Components (Unthemed)|FilterAdder', module)
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
