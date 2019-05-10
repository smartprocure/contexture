import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

let SearchLayout = ({ mode, ...props }) => (
  <div className={`gv-search-layout-${mode}`} {...props} />
)

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
