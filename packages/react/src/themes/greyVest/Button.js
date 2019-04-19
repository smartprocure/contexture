import React from 'react'

let Button = ({ isActive, primary, as: As = 'button', className, ...x }) => (
  <As
    className={`gv-button ${isActive ? 'active' : ''} ${
      primary ? 'primary' : ''
    } ${className || ''}`}
    {...x}
  />
)
export default Button
