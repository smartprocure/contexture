import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let Textarea = (props, ref) => (
  <textarea className="gv-input" {...props} ref={ref} />
)

export default _.flow(
  React.forwardRef,
  observer
)(Textarea)
