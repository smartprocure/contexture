import React from 'react'
export default ({ component: C = null, ...props }) => C && <C {...props} />
