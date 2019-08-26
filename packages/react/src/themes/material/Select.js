import React from 'react'
import { Observer } from 'mobx-react'
import _ from 'lodash/fp'
import { Select as MaterialSelect, MenuItem } from '@material-ui/core'

let Select = React.forwardRef(
  ({ options, placeholder = 'Please Select...', ...props }, ref) => (
    <Observer>
      {() => (
        <MaterialSelect fullWidth displayEmpty {...props} ref={ref}>
          <>
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          </>
          {_.map(
            x => (
              <MenuItem key={x.value} value={x.value}>
                {x.label}
              </MenuItem>
            ),
            options
          )}
        </MaterialSelect>
      )}
    </Observer>
  )
)

export default Select
