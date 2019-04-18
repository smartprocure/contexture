import React from 'react'

// Low effort custom checkbox
let Checkbox = ({ checked, onChange, style = {} }) => (
  <label
    className="gv-input gv-checkbox"
    style={{
      height: '20px',
      width: '20px',
      borderRadius: '3px',
      display: 'flex',
      justifyContent: 'center',
      cursor: 'pointer',
      ...(checked ? { backgroundColor: '#ebebeb' } : {}),
      ...style,
    }}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? (
      <i
        className="material-icons"
        style={{
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        check
      </i>
    ) : (
      String.fromCharCode(160)
    )}
  </label>
)
export default Checkbox