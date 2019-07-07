import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout'
import DefaultIcon from '../DefaultIcon'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on WizardStep because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = observer(({ step, totalSteps, currentStep, Button, Icon }) => (
  <>
    {step > 0 && (
      <Button onClick={F.sets(step - 1, currentStep)} className="back-button">
        <Icon icon="PreviousPage" />
        Back
      </Button>
    )}
    {step < totalSteps - 1 ? (
      <Button primary onClick={F.sets(step + 1, currentStep)} disabled={false}>
        Continue
      </Button>
    ) : (
      <Button primary>View Results</Button>
    )}
  </>
))

let WizardStep = ({
  Button = 'button',
  Icon = DefaultIcon,
  style,
  className,
  step,
  totalSteps,
  currentStep,
  stepTitle = '',
  isRequired = false,
  children,
}) => {
  let isOpen = F.view(currentStep) === step
  return (
    <div className={`wizard-step ${className ? className : ''}`} style={style}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <h1>
            <span className="step-number">Step {step + 1}</span> - {stepTitle}
          </h1>
          {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
        </Flex>
        <div className="filter-field-label-icon" style={{ cursor: 'default' }}>
          <Icon icon={isOpen ? 'FilterListCollapse' : 'FilterListExpand'} />
        </div>
      </Flex>
      {isOpen && (
        <>
          {children}
          <Buttons {...{ step, totalSteps, currentStep, Button, Icon }} />
        </>
      )}
    </div>
  )
}

WizardStep.displayName = 'WizardStep'
export default WizardStep
