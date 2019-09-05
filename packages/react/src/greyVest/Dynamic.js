import React from 'react'
let Dynamic = ({ component: C = null, ...props }) => C && <C {...props} />
Dynamic.displayName = 'Dynamic'

export default Dynamic
