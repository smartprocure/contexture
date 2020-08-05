import React from 'react'
import { withTheme } from '../utils/theme'

let ToggleFiltersButton = ({ onClick, theme: { AlternateButton, Icon } }) => (
  <AlternateButton title="Show Filters" onClick={onClick}>
    <Icon icon="FilterExpand" />
  </AlternateButton>
)
export default withTheme(ToggleFiltersButton)
