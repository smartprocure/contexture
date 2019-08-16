import React from 'react'

// Low effort custom checkbox
export default ({ checked, onChange, style = {} }) => (
  <label
    className="bb-input"
    style={{
      height: '24px',
      width: '24px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2px',
      cursor: 'pointer',
      ...style,
    }}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? '✔' : String.fromCharCode(160)}
  </label>
)
