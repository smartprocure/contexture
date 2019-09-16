import React from 'react'
import { Flex, Box, ErrorList, TextInput } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest|ErrorList',
  decorators: [decorator],
  component: ErrorList,
}

export let formDemo = () => (
  <Box>
    <h1 style={{ margin: '15px 0' }}>Header</h1>
    <ErrorList block>Block error</ErrorList>
    <Flex column style={{ marginBottom: 25 }}>
      <Flex as="label" column style={{ flex: 1 }}>
        <div className="filter-field-label" style={{ marginBottom: 14 }}>
          Label
        </div>
        <TextInput style={{ borderColor: '#D75050' }} />
      </Flex>
      <ErrorList>Text error</ErrorList>
    </Flex>
  </Box>
)
export let text = () => <ErrorList>I am an error</ErrorList>
export let block = () => (
  <ErrorList block>
    {['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]}
  </ErrorList>
)
