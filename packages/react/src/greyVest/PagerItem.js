import React from 'react'
import { observer } from 'mobx-react'

let PagerItem = ({ active, disabled, ...props }) => (
  <span
    className={`gv-pager-item ${disabled ? 'disabled' : ''} ${
      active ? 'active' : ''
    }`}
    {...props}
  />
)

export default observer(PagerItem)
