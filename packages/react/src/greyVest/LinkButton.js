import React from 'react'
import F from 'futil-js'

let LinkButton = ({ className = '', ...props }) => (
  <button
    className={F.compactJoin(' ', ['gv-link-button', className])}
    {...props}
  />
)

export default LinkButton
