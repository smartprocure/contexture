import React from 'react'
import { Observer } from 'mobx-react'
import _ from 'lodash/fp'

let Select = React.forwardRef(
  ({ options, placeholder = 'Please Select...', ...props }, ref) => (
    <Observer>
      {() => (
        <select {...props} ref={ref}>
          {placeholder && <option value="">{placeholder}</option>}
          {_.map(
            x => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ),
            options
          )}
        </select>
      )}
    </Observer>
  )
)

export default Select
