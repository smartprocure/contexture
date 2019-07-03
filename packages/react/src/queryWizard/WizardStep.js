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
  <div className={`wizard-step ${className ? className : ''}`} style={style}>
    <Flex alignItems="center" justifyContent="space-between">
      <h1>
        <span className="step-number">Step {step + 1}</span> -{' '}
        {step === 0
          ? `Search for ${node.friendlyName || node.key} by...`
          : `And...`}
      </h1>
      <div
        className="filter-field-label-icon"
        onClick={F.sets(step, currentStep)}
        style={{ cursor: 'pointer' }}
      >
        <Icon icon={expanded ? 'FilterListCollapse' : 'FilterListExpand'} />
      </div>
    </Flex>
    {expanded && (
      <>
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
          className="main-wizard-group"
        />
        {step > 0 && (
          <Button
            onClick={F.sets(step - 1, currentStep)}
            className="back-button"
          >
            <Icon icon="PreviousPage" />
            Back
          </Button>
        )}
        {step < totalSteps - 1 ? (
          <Button primary onClick={F.sets(step + 1, currentStep)}>
            Continue
          </Button>
        ) : (
          <Button primary>View Results</Button>
        )}
      </>
    )}
  </div>
)
