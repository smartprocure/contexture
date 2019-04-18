import React from 'react'
import _ from 'lodash/fp'

// Error Text / List General Components
let ErrorText = ({ children }) => (
  <div className="gv-text-error">{children}</div>
)
let ErrorList = ({ children }) =>
  _.map(e => <ErrorText key={e}>{e}</ErrorText>, _.castArray(children))

export default ErrorList