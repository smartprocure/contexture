import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let Select = ({ options, placeholder = 'Please Select...', ...props }) => (
  <select {...props}>
    <option value="">{placeholder}</option>
    {_.map(
      x => (
        <option key={x.value} value={x.value}>
          {x.label}
        </option>
      ),
      options
    )}
  </select>
)
export default observer(Select)
