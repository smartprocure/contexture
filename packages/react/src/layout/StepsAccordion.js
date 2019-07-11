import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import { Flex } from './Flex'
import { splitKeys } from '../utils/futil'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on Step because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = observer(
  ({ step, totalSteps, currentStep, Button, Icon, onSubmit }) => (
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
          disabled={false}
        >
          Continue
        </Button>
      ) : (
        <Button primary onClick={onSubmit}>
          View Results
        </Button>
      )}
    </>
  )
)

let Step = ({
  Button,
  Icon,
  style,
  className,
  step,
  totalSteps,
  currentStep,
  stepTitle = '',
  isRequired = false,
  onSubmit,
  children,
}) => {
  let isOpen = F.view(currentStep) === step
  return (
    <div className={`wizard-step ${className ? className : ''}`} style={style}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <h1>
            <span className="step-number">Step {step + 1}</span>
            {stepTitle && ` - ${stepTitle}`}
          </h1>
          {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
        </Flex>
        <div
          className="filter-field-label-icon"
          style={{ cursor: 'pointer' }}
          onClick={F.sets(isOpen ? -1 : step, currentStep)}
        >
          <Icon icon={isOpen ? 'FilterListCollapse' : 'FilterListExpand'} />
        </div>
      </Flex>
      {isOpen && (
        <>
          <div className="step-contents">{children}</div>
          <Buttons
            {...{ step, totalSteps, currentStep, onSubmit, Button, Icon }}
          />
        </>
      )}
    </div>
  )
}

let StepsAccordion = ({
  Button = 'button',
  Icon = DefaultIcon,
  onSubmit = _.noop,
  children,
  ...props
}) => {
  let currentStep = F.stateLens(React.useState(0))
  let splitProps = splitKeys(['stepTitle', 'isRequired'])
  return (
    <div {...props}>
      {React.Children.map(children, (child, i) => {
        let [propsForStep, propsForChild] = splitProps(child.props)
        return (
          <Step
            {...{ Button, Icon, currentStep, onSubmit }}
            key={i}
            step={i}
            totalSteps={_.size(children)}
            {...propsForStep}
          >
            <child.type {...propsForChild} />
          </Step>
        )
      })}
    </div>
  )
}

StepsAccordion.displayName = 'StepsAccordion'
export default StepsAccordion
