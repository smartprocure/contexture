import React from 'react'
import { withNode } from './utils/hoc'

let DefaultMissingTypeComponent = withNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))
DefaultMissingTypeComponent.displayName = 'DefaultMissingTypeComponent'
export default DefaultMissingTypeComponent
