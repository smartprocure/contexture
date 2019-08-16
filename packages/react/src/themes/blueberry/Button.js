import React from 'react'

export default ({
  isActive,
  primary,
  style = {},
  as: As = 'button',
  ...props
}) => (
  <As
    className="bb-input"
    style={{
      minWidth: '150px',
      padding: '5px',
      margin: '5px',
      borderRadius: '50px',
      cursor: 'pointer',
      ...(isActive && { borderColor: '#0076DE', color: '#0076DE' }),
      ...(primary && { background: '#0076DE', color: '#FFF' }),
      ...style,
    }}
    {...props}
  />
)
