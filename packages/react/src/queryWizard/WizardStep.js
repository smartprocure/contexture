import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import { Flex } from '../layout/Flex'
import FilterButtonList from './FilterButtonList'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on WizardStep because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = observer(
  ({ node, step, totalSteps, currentStep, isRequired, Button, Icon }) => (
    <>
      {step > 0 && (
        <Button onClick={F.sets(step - 1, currentStep)} className="back-button">
          <Icon icon="PreviousPage" />
          Back
        </Button>
      )}
      {step < totalSteps - 1 ? (
        <Button
          primary
          onClick={F.sets(step + 1, currentStep)}
          disabled={isRequired && !node.hasValue}
        >
          Continue
        </Button>
      ) : (
        <Button primary>View Results</Button>
      )}
    </>
  )
)

let WizardStep = ({
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
  isRequired = false,
}) => (
  <div className={`wizard-step ${className ? className : ''}`} style={style}>
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <h1>
          <span className="step-number">Step {step + 1}</span> -{' '}
          {step === 0
            ? `Search for ${node.friendlyName || node.key} by...`
            : `And...`}
        </h1>
        {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
      </Flex>
      <div className="filter-field-label-icon" style={{ cursor: 'default' }}>
        <Icon icon={expanded ? 'FilterListCollapse' : 'FilterListExpand'} />
      </div>
    </Flex>
    {expanded && (
      <>
        <FilterButtonList
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
          className="main-filter-button-list"
        />
        <Buttons
          {...{ node, step, totalSteps, currentStep, isRequired, Button, Icon }}
        />
      </>
    )}
  </div>
)

WizardStep.displayName = 'WizardStep'
export default WizardStep
