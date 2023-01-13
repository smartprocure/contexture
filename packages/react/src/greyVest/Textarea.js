import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'

let Textarea = (props, ref) => (
  <textarea className="gv-input" {...props} ref={ref} />
)

export default _.flow(React.forwardRef, observer)(Textarea)
