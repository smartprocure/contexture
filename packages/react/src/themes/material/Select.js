import React from 'react'
import { Observer } from 'mobx-react'
import _ from 'lodash/fp'
import { Select as MaterialSelect, MenuItem } from '@material-ui/core'

let Select = ({
  options,
  placeholder = 'Please Select...',
  value = '',
  ...props
}) => (
  <Observer>
    {() => (
      <MaterialSelect fullWidth displayEmpty value={value} {...props}>
        {placeholder && <MenuItem value="">{placeholder}</MenuItem>}
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

export default Select
