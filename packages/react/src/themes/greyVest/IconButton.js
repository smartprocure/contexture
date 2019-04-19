import React from 'react'

let IconButton = ({ className, primary, ...props }) => (
  <div
    className={`gv-icon-button ${className || ''} ${primary ? 'primary' : ''}`}
    {...props}
  />
)
export default IconButton
