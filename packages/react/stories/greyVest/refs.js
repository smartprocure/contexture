import React from 'react'
import {
  Fonts,
  GVStyle,
  Button,
  TextInput,
  Textarea,
  Select,
} from './../../src/themes/greyVest'

let input
let select
let textArea

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column' }} className="gv-body">
    <Fonts />
    <GVStyle />
    <TextInput ref={e => (input = e)} />
    <Textarea ref={e => (textArea = e)} />
    <Select ref={e => (select = e)} />
    <Button onClick={() => input.focus()}>Focus Input</Button>
    <Button onClick={() => textArea.focus()}>Focus Text Area</Button>
    <Button onClick={() => select.focus()}>Focus Select</Button>
  </div>
)
