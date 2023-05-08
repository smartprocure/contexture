import React from 'react'
import Flex from './Flex.js'

export default React.forwardRef((props, ref) => (
  <Flex ref={ref} className="gv-button-group" {...props} />
))
