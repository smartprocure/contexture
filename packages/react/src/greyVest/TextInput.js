import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let TextInput = ({ className = '', type = 'text', ...props }, ref) => (
  <input className={`${className} gv-input`} {...{ type, ref, ...props }} />
)

export default _.flow(
  React.forwardRef,
  observer
)(TextInput)
