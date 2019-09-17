import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import { Select as MaterialSelect, MenuItem } from '@material-ui/core'

let Select = (
  { options, placeholder = 'Please Select...', value = '', ...props },
  ref
) => (
  <MaterialSelect fullWidth displayEmpty value={value} {...props} ref={ref}>
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
)

export default _.flow(
  React.forwardRef,
  observer
)(Select)
