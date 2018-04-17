import React from 'react'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import FilterAdder from '../src/FilterAdder'
import {applyDefaults} from '../src/utils/schema'

let Select = ({options, onChange}) => (
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

export default () => {
  storiesOf('FilterAdder', module).add('Example', () => (
    <div>
      <FilterAdder
        Picker={Select}
        tree={{
          add: action('add'),
          getNode: () => {},
        }}
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
}
