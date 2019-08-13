import React from 'react'

export default ({ style = {}, ...props }) => <b style={{ backgroundColor: 'yellow', ...style }} {...props} />
