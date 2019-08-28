import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import DatePicker from 'react-date-picker'
import _ from 'lodash/fp'

let NativeDateInput = ({ value, onChange }) => (
  <input
    type="date"
    value={value ? moment(value).format('YYYY-MM-DD') : ''}
    onChange={e => onChange(new Date(e.target.value))}
  />
)

let ReactDatePickerInput = ({
  value,
  calendarIcon = null,
  clearIcon = null,
  ...props
}) => (
  <DatePicker
    calendarType={'US'}
    calendarIcon={calendarIcon}
    clearIcon={clearIcon}
    value={_.isDate(value) || _.isEmpty(value) ? value : new Date(value)}
    {...props}
  />
)

let DateInput = ({ value, native = false, ...props }) =>
  native ? (
    <NativeDateInput value={value} {...props} />
  ) : (
    <ReactDatePickerInput value={value} {...props} />
  )

export default observer(DateInput)
