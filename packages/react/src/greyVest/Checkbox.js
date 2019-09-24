import React from 'react'

// Low effort custom checkbox
let Checkbox = ({ checked, onChange = () => {}, style = {} }) => (
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
      String.fromCharCode(160) // non-breaking space
    )}
  </label>
)
export default Checkbox

Checkbox.info = {
  classes: {}, // for css overrides - maybe a hierarchy object?
  themeProps: [], // this can just be a list
  props: {
    checked: {
      type: Boolean,
      description:
        'Determines if the checkbox is checked. Adds the `checked` className if true.',
      defaultValue: false,
    },
    onChange: {
      type: Function,
      description: 'Executed when the `checked` property is changed.',
    },
    style: {
      type: Object,
      description: 'Style overrides',
      defaultValue: {},
      // type: { oneOf: ['A', 'B', 'C'] }
    },
    // need to represent enums and objects like tree or node
  },
}
