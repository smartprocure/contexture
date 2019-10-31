import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

let margin = 24

let styles = mode => ({
  display: 'grid',
  gridGap: margin,
  margin: `0 ${margin}px`,
  marginBottom: margin,
  gridTemplateColumns:
    mode === 'basic' ? 'minmax(250px, 400px) minmax(0, 1fr)' : 'minmax(0, 1fr)',
})

let SearchLayout = ({ mode, style, className, ...props }) => (
  <div
    className={`search-layout search-layout-${mode} ${className}`}
    style={{ ...styles(mode), ...style }}
    {...props}
  />
)

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
