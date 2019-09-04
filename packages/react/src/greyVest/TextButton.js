import React from 'react'

let TextButton = ({ className, primary, ...props }) => (
  <div
    className={`gv-icon-button ${className || ''} ${primary ? 'primary' : ''}`}
    {...props}
  />
)
export default TextButton
