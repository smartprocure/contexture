import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

let style = mode => ({
  display: 'grid',
  gridGap: 40,
  margin: '0 40px',
  marginBottom: 50,
  gridTemplateColumns:
    mode === 'basic' ? 'minmax(250px, 400px) minmax(0, 1fr)' : 'minmax(0, 1fr)',
})

let SearchLayout = ({ mode, ...props }) => (
  <div style={style(mode)} {...props} />
)

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
