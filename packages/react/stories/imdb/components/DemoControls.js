import * as F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { withStateLens, hover } from '../../../src/utils/mobx-react-utils'
import { Flex, TextHighlight } from '../../../src/layout/'

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

export let Input = x => (
  <input
    style={{
      width: '100%',
      padding: '5px 15px',
      border: 'solid 1px #efefef',
      borderRadius: '50px',
      boxSizing: 'border-box',
      outline: 'none',
    }}
    {...x}
  />
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

export let PagerList = x => <Flex {...x} />
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
