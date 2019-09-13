import React from 'react'

let Dynamic = ({ component: C = null, ...props }) => C && <C {...props} />

export default Dynamic
