import React from 'react'

export default ({
  isActive,
  primary,
  style = {},
  as: As = 'button',
  className,
  ...props
}) => (
  <As
    className={`gv-input ${className}`}
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
