import F from 'futil'
import React from 'react'
import { storiesOf } from '@storybook/react'
import ThemePicker from '../stories/themePicker'
import { useTheme } from '../utils/theme'
import { StepsAccordion, AccordionStep } from '.'

let makeStepTitle = title => n => (
  <h1>
    <span className="step-number">{n + 1}) </span>
    {title}
  </h1>
)

storiesOf('Components|Search Components/Internals', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('StepsAccordion', () => {
    let isClicked = React.useState(false)
    let theme = useTheme()
    return (
      <StepsAccordion>
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
      </StepsAccordion>
    )
  })
