import React from 'react'

// Low effort custom checkbox
let Checkbox = React.forwardRef(
  ({ checked, onChange = () => {}, style = {} }, ref) => (
    <label
      className={`gv-input gv-checkbox ${checked ? 'checked' : ''}`}
      style={style}
      ref={ref}
    >
      <input
        type="checkbox"
        style={{ display: 'none' }}
        {...{ checked, onChange }}
      />
      {checked ? (
        <i className="material-icons">check</i>
      ) : (
        String.fromCharCode(160) // non-breaking space
      )}
    </label>
  )
)
export default Checkbox
