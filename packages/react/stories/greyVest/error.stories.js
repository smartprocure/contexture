import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Flex } from './../../src/layout/Flex'
import { Box, ErrorList, Input } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Error', module)
  .addDecorator(decorator)
  .addWithJSX('Text', () => <ErrorList>I am an error</ErrorList>)
  .addWithJSX('Block', () => (
    <ErrorList block>
      {['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]}
    </ErrorList>
  ))
  .addWithJSX('Form Demo', () => (
    <Box>
      <h1 style={{ margin: '15px 0' }}>Header</h1>
      <ErrorList block>Block error</ErrorList>
      <Flex column style={{ marginBottom: 25 }}>
        <Flex as="label" column style={{ flex: 1 }}>
          <div className="filter-field-label" style={{ marginBottom: 14 }}>
            Label
          </div>
          <Input style={{ borderColor: '#D75050' }} />
        </Flex>
        <ErrorList>Text error</ErrorList>
      </Flex>
    </Box>
  ))