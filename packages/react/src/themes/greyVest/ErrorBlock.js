import React from 'react'
import ErrorList from './ErrorList'
import { Flex } from '../../layout/Flex'

let ErrorBlock = ({children, ...props}) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <i className="material-icons" style={{ marginRight: 8 }}>
      warning
    </i>
    <div>
      <ErrorList>{children}</ErrorList>
    </div>
  </Flex>
)
export default ErrorBlock
