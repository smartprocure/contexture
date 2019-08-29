import React from 'react'
import { withNode } from '../../utils/hoc'

let UnmappedNodeComponent = withNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))
UnmappedNodeComponent.displayName = 'DefaultUnmappedNodeComponent'
export default UnmappedNodeComponent
