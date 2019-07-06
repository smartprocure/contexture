import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import DefaultIcon from '../DefaultIcon'
import WizardStep from './WizardStep'

let QueryWizard = ({
  tree,
  path,
  CheckButton = DefaultCheckButton,
  Button = 'button',
  Modal = DefaultModal,
  Icon = DefaultIcon,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
  className,
  style,
}) => {
  let currentStep = F.stateLens(React.useState(0))
  return (
    <div className={className} style={style}>
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
              Icon,
              Modal,
              currentStep,
            }}
            key={node.key}
            step={i}
            expanded={F.view(currentStep) === i}
            totalSteps={_.size(tree.getNode(path).children)}
            isRequired={i === 0}
          />
        ),
        tree.getNode(path).children || []
      )}
    </div>
  )
}

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
