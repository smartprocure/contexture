import React from 'react'
import InjectTreeNode from './utils/injectTreeNode'

let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))
DefaultMissingTypeComponent.displayName = 'DefaultMissingTypeComponent'
export default DefaultMissingTypeComponent
