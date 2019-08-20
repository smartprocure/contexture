import React from 'react'
import { observer } from 'mobx-react'

let TableHeaderCell = ({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
)

export default observer(TableHeaderCell)
