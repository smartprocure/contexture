import React from 'react'

// Low effort custom checkbox
let Checkbox = ({ checked, onChange, style = {} }) => (
  <label
    className={`gv-input gv-checkbox ${checked ? 'checked' : ''}`}
    style={style}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? (
      <i className="material-icons">check</i>
    ) : (
      String.fromCharCode(160)
    )}
  </label>
)
export default Checkbox
