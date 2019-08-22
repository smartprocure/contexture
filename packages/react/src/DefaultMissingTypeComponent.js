import React from 'react'
import _ from 'lodash/fp'
import { setDisplayName } from 'recompose'
import { withNode } from './utils/hoc'

let DefaultMissingTypeComponent = _.flow(
  setDisplayName('DefaultMissingTypeComponent'),
  withNode
)(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

export default DefaultMissingTypeComponent
