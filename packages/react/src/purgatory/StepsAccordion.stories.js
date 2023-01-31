import F from 'futil'
import React from 'react'
import { useTheme } from '../utils/theme.js'
import Component, { AccordionStep } from './StepsAccordion.js'

export default {
  component: Component,
}

let makeStepTitle = (title) => (n) =>
  (
    <h1>
      <span className="step-number">{n + 1}) </span>
      {title}
    </h1>
  )

export const StepsAccordion = () => {
  let isClicked = React.useState(false)
  let theme = useTheme()
  return (
    <Component>
      <AccordionStep isRequired={true} title={makeStepTitle()}>
        <div>
          <div>A</div>
          <div>B</div>
          <div>C</div>
        </div>
      </AccordionStep>
      <AccordionStep
        isRequired={true}
        title={makeStepTitle('Click the button')}
      >
        <theme.Button onClick={F.on(isClicked)}>
          Button {F.view(isClicked) && '(clicked)'}
        </theme.Button>
      </AccordionStep>
      <AccordionStep title={makeStepTitle('Type something')}>
        <theme.TextInput type="text" />
      </AccordionStep>
    </Component>
  )
}
