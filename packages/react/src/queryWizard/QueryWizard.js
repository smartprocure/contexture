//import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import StepGroup from './StepGroup'


export default ({ 
  tree,
  CheckButton = DefaultCheckButton,
  Button = 'button',
  Modal = DefaultModal,
  fields,
  mapNodeToProps
}) => (
  <div>
    {F.mapIndexed((node, i) => 
      <StepGroup
        node={node}
        tree={tree}
        CheckButton={CheckButton}
        Button={Button}
        Modal={Modal}
        stepNumber={i}
        mapNodeToProps={mapNodeToProps}
        fields={fields}
      />,
      tree.tree.children
    )}
  </div>
)
