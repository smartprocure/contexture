import React from 'react'
import _ from 'lodash/fp'
import Flex from '../layout/Flex'

let ErrorText = ({ children }) => (
  <div className="gv-text-error">{children}</div>
)

let ErrorBlock = ({ children, ...props }) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <i className="material-icons" style={{ marginRight: 8 }}>
      warning
    </i>
    <div>
      <ErrorList>{children}</ErrorList>
    </div>
  </Flex>
)

let ErrorList = ({ block = false, children }) =>
  _.map(
    e =>
      block ? (
        <ErrorBlock key={e}>{e}</ErrorBlock>
      ) : (
        <ErrorText key={e}>{e}</ErrorText>
      ),
    _.castArray(children)
  )

export default ErrorList
