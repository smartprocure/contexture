import React from 'react'
import { withNode } from '../../utils/hoc'

let UnmappedNodeComponent = ({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
)

export default withNode(UnmappedNodeComponent)
