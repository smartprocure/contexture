import React from 'react'
import { withNode } from '../../utils/hoc'

let MissingTypeComponent = withNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))
MissingTypeComponent.displayName = 'DefaultMissingTypeComponent'
export default MissingTypeComponent
