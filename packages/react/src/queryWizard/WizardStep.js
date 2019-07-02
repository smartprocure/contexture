import _ from 'lodash/fp'
import F from 'futil-js'
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
  Icon,
  fields,
  mapNodeToProps = _.noop,
  mapNodeToLabel = _.noop,
  style,
  className,
  step,
  expanded,
  totalSteps,
  currentStep,
}) => (
  <>
    <Flex alignItems="center">
      <h1>
        <span className="step-number">Step {step + 1}</span> - Search for{' '}
        {node.friendlyName || node.key}
      </h1>
      <div
        className="filter-field-label-icon"
        onClick={F.sets(step, currentStep)}
      >
        <Icon icon={expanded ? 'FilterListCollapse' : 'FilterListExpand'} />
      </div>
    </Flex>
    {expanded && (
      <>
        <Flex style={style} className={className}>
          <WizardGroup
            {...{
              tree,
              node,
              fields,
              mapNodeToProps,
              mapNodeToLabel,
              Button,
              CheckButton,
              Modal,
            }}
            className="wizard-group"
          />
        </Flex>
        {step > 0 && (
          <Button onClick={F.sets(step - 1, currentStep)}>{'<'} Back</Button>
        )}
        {step < totalSteps - 1 ? (
          <Button onClick={F.sets(step + 1, currentStep)}>Continue</Button>
        ) : (
          <Button>View Results</Button>
        )}
      </>
    )}
  </>
)
