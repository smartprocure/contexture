import React from 'react'
import { withNode } from '../../utils/hoc'
import ErrorText from '../../greyVest/ErrorText'

let MissingTypeComponent = ({ node = {} }) => (
  // Min Height here is to align better in QueryBuilder
  <Flex style={{ minHeight: '40px', alignItems: 'center' }}>
    <ErrorText>
      Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
    </ErrorText>
  </Flex>
)

export default withNode(MissingTypeComponent)
