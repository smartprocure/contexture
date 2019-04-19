import React from 'react'
import { Observer } from 'mobx-react'

let Textarea = React.forwardRef((props, ref) => (
  <Observer>
    {() => <textarea className="gv-input" {...props} ref={ref} />}
  </Observer>
))
Textarea.displayName = 'Textarea'

export default Textarea