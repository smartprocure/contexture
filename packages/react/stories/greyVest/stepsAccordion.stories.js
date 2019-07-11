import F from 'futil-js'
import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Button, Input, StepsAccordion } from '../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|StepsAccordion', module)
  .addDecorator(decorator)
  .addWithJSX('StepsAccordion', () => {
    let isClicked = F.stateLens(React.useState(false))
    return (
      <StepsAccordion onSubmit={() => alert('submitted')}>
        <div isRequired={true}>
          <div>A</div>
          <div>B</div>
          <div>C</div>
        </div>
        <Button
          isRequired={true}
          stepTitle="Click the button"
          onClick={F.on(isClicked)}
        >
          Button {F.view(isClicked) && '(clicked)'}
        </Button>
        <Input type="text" stepTitle="Type something" />
      </StepsAccordion>
    )
  })
