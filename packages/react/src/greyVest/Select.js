import React from 'react'
import { Observer } from 'mobx-react'
import DefaultSelect from '../layout/Select'

let Select = React.forwardRef((props, ref) => (
  <Observer>
    {() => <DefaultSelect className="gv-input" {...props} ref={ref} />}
  </Observer>
))
Select.displayName = 'Select'

export default Select
