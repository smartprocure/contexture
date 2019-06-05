import React from 'react'
import _ from 'lodash/fp'
import ErrorBlock from './ErrorBlock'
import ErrorText from './ErrorText'

let ErrorList = ({ block = false, children }) =>
  _.map(
      e => block
        ? <ErrorBlock key={e}>{e}</ErrorBlock>
        : <ErrorText key={e}>{e}</ErrorText>,
      _.castArray(children)
    )
export default ErrorList
