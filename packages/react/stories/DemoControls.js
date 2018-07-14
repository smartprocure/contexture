import * as F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import {
  withStateLens,
  hover,
  focus,
  partial,
} from '../src/utils/mobx-react-utils'
import ExampleTypeConstructor from '../src/exampleTypes/'
import { TextHighlight, FilteredPicker, ModalFilterAdder } from '../src'

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

export let Input = withStateLens({ focusing: false })(
  observer(({ focusing, ...x }) => (
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
      {...focus(focusing)}
      {...x}
    />
  ))
)

export let Highlight = x => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow' }} {...x} />}
    {...x}
  />
)

export let ListGroupItem = withStateLens({ hovering: false })(
  observer(({ hovering, ...x }) => (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      {...hover(hovering)}
      {...x}
    />
  ))
)

export let PagerItem = withStateLens({ hovering: false })(
  observer(({ active, hovering, ...x }) => (
    <span
      style={{
        padding: '5px',
        border: 'solid 1px #ccc',
        background: F.view(hovering) ? '#f5f5f5' : 'white',
        color: '#444',
        ...(active && { fontWeight: 'bold' }),
        cursor: 'pointer',
      }}
      {...hover(hovering)}
      {...x}
    />
  ))
)

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

export let Adder = ModalFilterAdder({
  Button,
  Input,
  Highlight,
  Item: ListGroupItem,
})

export let ExampleTypes = ExampleTypeConstructor({
  Input,
  Table: 'table',
  FieldPicker: partial({
    Input,
    Highlight,
    Item: ListGroupItem
  }, FilteredPicker)
})
let { ResultPager } = ExampleTypes
export let Pager = partial({ Item: PagerItem }, ResultPager)
