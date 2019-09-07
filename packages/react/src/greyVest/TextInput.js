import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let TextInput = ({ className = '', style, type = 'text', ...x }, ref) => (
  <input
    className={`${className} gv-input`}
    style={{
      ...style,
    }}
    type={type}
    ref={ref}
    {...x}
  />
)

export default _.flow(
  React.forwardRef,
  observer
)(TextInput)
