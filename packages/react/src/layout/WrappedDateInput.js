import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

let WrappedDateInput = ({ value, onChange, ...props }) => (
  <input
    type="date"
    value={value ? moment(value).format('YYYY-MM-DD') : ''}
    onChange={e => onChange(new Date(e.target.value))}
    {...props}
  />
)

export default observer(WrappedDateInput)
