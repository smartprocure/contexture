import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { ErrorList } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Error', module)
  .addDecorator(decorator)
  .addWithJSX('Text', () => (
    <ErrorList>I am an error</ErrorList>
  ))
  .addWithJSX('Block', () => (
    <ErrorList block>{[
      "Error 1", 
      "Error 2", 
      ["Error 3A", "Error 3B"]
    ]}</ErrorList>
  ))
