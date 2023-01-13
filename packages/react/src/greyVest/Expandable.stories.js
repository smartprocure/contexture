import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import ThemePicker from '../stories/themePicker.js'
import Flex from './Flex.js'
import Box from './Box.js'
import Expandable from './Expandable.js'

let ExpandableDemo = ({ style, ...props }) => {
  let [expanded, setExpanded] = useState(false)
  return (
    <Flex justifyContent="center" style={style} {...props}>
      <Box style={{ width: 300, margin: 16 }}>
        <Expandable
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
        </Expandable>
      </Box>
    </Flex>
  )
}

storiesOf('GreyVest Library|Expandable', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Expandable', () => <ExpandableDemo />)
