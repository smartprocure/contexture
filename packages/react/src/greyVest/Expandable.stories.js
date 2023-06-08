import React, { useState } from 'react'
import Flex from './Flex.js'
import Box from './Box.js'
import Component from './Expandable.js'

export default {
  component: Component,
}

export const Expandable = () => {
  let [expanded, setExpanded] = useState(false)
  return (
    <Flex justifyContent="center">
      <Box style={{ width: 300, margin: 16 }}>
        <Component
          isOpen={expanded}
          onClick={() => setExpanded(!expanded)}
          Label={'Section Label'}
        >
          <div>Section Content 1</div>
          <div>Section Content 2</div>
          <div>Section Content 2</div>
          <div>Section Content 4</div>
          <div>Section Content 5</div>
          <div>Section Content 6</div>
        </Component>
      </Box>
    </Flex>
  )
}
