import React from 'react'
import F from 'futil'

let Box = ({ className = '', ...props }) => (
  <div className={F.compactJoin(' ', ['gv-box', className])} {...props} />
)

export default Box
