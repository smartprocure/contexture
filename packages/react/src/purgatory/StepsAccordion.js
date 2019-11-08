import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import React from 'react'
import { setDisplayName } from 'recompose'
import { Flex } from '../greyVest'
import { withTheme } from '../utils/theme'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on Step because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = _.flow(
  setDisplayName('Buttons'),
  observer,
  withTheme
)(({ step, totalSteps, currentStep, onSubmit, theme: { Button, Icon } }) => (
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
      <Button primary onClick={onSubmit}>
        View Results
      </Button>
    )}
  </>
))

export let AccordionStep = _.flow(
  setDisplayName('AccordionStep'),
  withTheme
)(
  ({
    style,
    className,
    step,
    totalSteps,
    currentStep,
    title,
    isRequired = false,
    onSubmit,
    children,
    theme: { Icon },
  }) => {
    let open = F.view(currentStep) === step
    return (
      <div className={`accordion-step ${className || ''}`} style={style}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          onClick={F.sets(open ? -1 : step, currentStep)}
          style={{ cursor: 'pointer' }}
        >
          <Flex alignItems="center">
            <div className="accordion-step-title">
              {F.callOrReturn(title, step)}
            </div>
            {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
          </Flex>
          <div className="filter-field-label-icon">
            <Icon icon={open ? 'FilterListCollapse' : 'FilterListExpand'} />
          </div>
        </Flex>
        {open && (
          <>
            <div className="step-contents">{children}</div>
            <Buttons {...{ step, totalSteps, currentStep, onSubmit }} />
          </>
        )}
      </div>
    )
  }
)

let StepsAccordion = ({ onSubmit = _.noop, children, className, ...props }) => {
  let currentStep = React.useState(0)
  return (
    <div className={`steps-accordion ${className || ''}`} {...props}>
      {React.Children.map(children, (child, i) => (
        <child.type
          {...{ currentStep, onSubmit }}
          key={i}
          step={i}
          totalSteps={_.size(children)}
          {...child.props}
        />
      ))}
    </div>
  )
}

export default StepsAccordion
