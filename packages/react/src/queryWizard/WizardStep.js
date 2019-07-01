import _ from 'lodash/fp'
import React from 'react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import { Flex } from '../layout/Flex'
import WizardGroup from './WizardGroup'

export default ({
  node,
  tree,
  CheckButton = DefaultCheckButton,
  Button = 'button',
  Modal = DefaultModal,
  fields,
  mapNodeToProps = _.noop,
  mapNodeToLabel = _.noop,
  style,
  className,
  stepNumber,
}) => (
  <div>
    <h1>
      Step {stepNumber + 1} - Search for {node.friendlyName || node.key}
    </h1>
    <Flex style={style} className={className}>
      <WizardGroup
        {...{
          tree,
          node,
          fields,
          mapNodeToProps,
          mapNodeToLabel,
          className: 'wizard-group',
          Button,
          CheckButton,
          Modal,
        }}
      />
    </Flex>
    <Button>Continue</Button>
  </div>
)
