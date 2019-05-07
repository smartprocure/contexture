import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import DatePicker from 'react-date-picker'

let DateInput = observer(
  ({ value, calendarIcon = null, clearIcon = null, ...props }) => (
    <DatePicker
      calendarType={'US'}
      calendarIcon={calendarIcon}
      clearIcon={clearIcon}
      value={_.isDate(value) ? value : new Date(value)}
      {...props}
    />
  )
)
export default DateInput
