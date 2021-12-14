import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { defaultProps } from 'react-recompose'

import { TextHighlight } from '..'

export let Button = x => (
  <button
    style={{
      width: '100%',
      padding: '5px',
      margin: '5px 0',
      borderRadius: '5px',
    }}
    {...x}
  />
)

let Input = observer(props => {
  let focusing = React.useState(false)
  return (
    <input
      style={{
        width: '100%',
        padding: '5px',
        textIndent: '5px',
        border: 'solid 1px #efefef',
        borderRadius: '30px',
        boxSizing: 'border-box',
        outline: 'none',
        margin: '0 auto',
        display: 'block',
        transition: 'background 0.3s',
        background: `rgba(255, 255, 255, ${F.view(focusing) ? 1 : 0.7})`,
      }}
      {...F.domLens.focus(focusing)}
      {...props}
    />
  )
})

export let TextInput = defaultProps({ type: 'text' })(Input)
export let NumberInput = defaultProps({ type: 'number' })(Input)

export let Highlight = x => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow' }} {...x} />}
    {...x}
  />
)

export let DropdownItem = observer(props => {
  let hovering = React.useState(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
})

export let PagerItem = observer(({ active, ...props }) => {
  let hovering = React.useState(false)
  return (
    <span
      style={{
        padding: '5px',
        border: 'solid 1px #ccc',
        background: F.view(hovering) ? '#f5f5f5' : 'white',
        color: '#444',
        ...(active && { fontWeight: 'bold' }),
        cursor: 'pointer',
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
})

export let DarkBox = props => (
  <div
    {...props}
    style={{
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px',
    }}
  />
)

let textTruncate = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // WebkitLineClamp: '4',
  // WebkitBoxOrient: 'vertical',
  maxHeight: '100px',
}
export let ClampedHTML = x => (
  <div style={textTruncate} dangerouslySetInnerHTML={{ __html: x }} />
)

export default {
  Button,
  TextInput,
  NumberInput,
  TextHighlight: Highlight,
  DropdownItem,
  PagerItem,
}
