import React from 'react'
import _ from 'lodash/fp'
import ErrorText from './ErrorText'

let ErrorList = ({ children }) =>
  _.map(e => <ErrorText key={e}>{e}</ErrorText>, _.castArray(children))
export default ErrorList