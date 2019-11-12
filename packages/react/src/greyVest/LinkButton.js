import React from 'react'
import F from 'futil'

let LinkButton = ({ className = '', ...props }) => (
  <button
    className={F.compactJoin(' ', ['gv-link-button', className])}
    {...props}
  />
)

export default LinkButton
