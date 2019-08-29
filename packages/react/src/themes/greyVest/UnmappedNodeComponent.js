import React from 'react'
import { withNode } from '../../utils/hoc'
import ErrorList from '../../greyVest/ErrorList'

let UnmappedNodeComponent = ({ node = {} }) => (
  // Min Height here is to align better in QueryBuilder
  <Flex style={{ minHeight: '40px', alignItems: 'center' }}>
    <ErrorList>
      Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
    </ErrorList>
  </Flex>
)

export default withNode(UnmappedNodeComponent)
