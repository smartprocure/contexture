import React from 'react'
import IconButton from './IconButton'

let ToggleFiltersButton = ({ onClick }) => (
  <IconButton title="Toggle Filters" onClick={onClick}>
    <i className="material-icons">filter_list</i>
  </IconButton>
)
export default ToggleFiltersButton
