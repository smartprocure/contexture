//import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import WizardStep from './WizardStep'

export default ({
  tree,
  CheckButton = DefaultCheckButton,
  Button = 'button',
  Modal = DefaultModal,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
}) => (
  <div>
    {F.mapIndexed(
      (node, i) => (
        <WizardStep
          {...{
            node,
            tree,
            fields,
            mapNodeToProps,
            mapNodeToLabel,
            CheckButton,
            Button,
            Modal,
          }}
          stepNumber={i}
        />
      ),
      tree.tree.children
    )}
  </div>
)
