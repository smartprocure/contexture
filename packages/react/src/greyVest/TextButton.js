import React from 'react'

let TextButton = ({ className, primary, ...props }) => (
  <div
    className={`gv-text-button ${className || ''} ${primary ? 'primary' : ''}`}
    {...props}
  />
)
export default TextButton
