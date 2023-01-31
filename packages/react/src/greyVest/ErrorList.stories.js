import React from 'react'
import Component from './ErrorList.js'
import { Flex, Box, TextInput } from './index.js'

export default {
  component: Component,
}

export const Text = { args: { children: 'I am an error' } }

export const Block = {
  args: {
    block: true,
    children: ['Error 1', 'Error 2', ['Error 3A', 'Error 3B']],
  },
}

export const FormDemo = () => (
  <Box>
    <h1 style={{ margin: '15px 0' }}>Header</h1>
    <Component block>Block error</Component>
    <Flex column style={{ marginBottom: 25 }}>
      <Flex as="label" column style={{ flex: 1 }}>
        <div className="filter-field-label" style={{ marginBottom: 14 }}>
          Label
        </div>
        <TextInput style={{ borderColor: '#D75050' }} />
      </Flex>
      <Component>Text error</Component>
    </Flex>
  </Box>
)
