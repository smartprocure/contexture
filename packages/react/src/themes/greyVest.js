import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { partial, withStateLens, hover } from '../utils/mobx-react-utils'
import { Flex, TextHighlight } from '../layout'
import ModalFilterAdder from '../ModalFilterAdder'
import ExampleTypeConstructor from '../exampleTypes/'

export let Input = x => (
  <input
    style={{ padding: '5px', textIndent: '5px', margin: '5px auto' }}
    {...x}
  />
)

// Low effort custom checkbox
export let Checkbox = ({ checked, onChange }) => (
  <div
    className="gv-input"
    style={{
      height: '24px',
      width: '24px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2px',
      cursor: 'pointer',
    }}
    onClick={() => onChange(!checked)}
  >
    {checked ? '✔' : String.fromCharCode(160)}
  </div>
)

export let GVStyle = () => (
  <style>
    {`
      h1 { font-size: 22px; }
      
      .gv-table {
        border-collapse: collapse;
        width: 100%;
      }
      .gv-table tbody tr {
        border-bottom: solid 2px #EDEDED;
        height: 100px;
      }
      .gv-table td, .gv-table th {
        padding: 20px;
        text-align: left;
        min-width: 100px;
      }
      .gv-table thead tr {
        border-bottom: solid 2px #9ABCDA;
      }
      
      .gv-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 #EDEDED;
        padding: 15px;
      }
      
      .gv-body, body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 16px;
        color: #454545;
      }
      
      .gv-input, .gv-body select, .gv-body button, .gv-body input {
        outline: none;
        font-size: 16px;
        font-family: Lato;
        
        border: solid 2px #EDEDED;
        background: #fff;
        
        display: block;
        width: 100%;
        
        box-sizing: border-box;
        height: 40px;
      }
      
      .gv-body select, .gv-body input {
        border-radius: 4px;
      }
      .gv-body select {
        cursor: pointer;
      }
      
      .gv-body .tags-input {
        border: 2px solid #EBEBEB;
        border-radius: 4px;
        min-height: 40px;
        padding: 5px;
        box-sizing: border-box;
        margin: 5px auto;
        background: #fff;
      }
      /* To reach perfect 40px, remove real input padding because we have it on the fake one */
      .gv-body .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
      }
      .gv-body .tags-input-tag {
        border-radius: 4px;
        /* more than 3 and the tag will be taller than 26 */
        padding: 3px;
        margin: 0 2px;
      }
      
      .contexture-facet a {
        color: #0076de
      }
    `}
  </style>
)
export let Table = x => <table className="gv-table" {...x} />

export let Button = ({ isActive, primary, style = {}, ...x }) => (
  <button
    style={{
      minWidth: '150px',
      padding: '5px',
      margin: '5px',
      borderRadius: '50px',
      cursor: 'pointer',
      ...(isActive && { borderColor: '#0076DE', color: '#0076DE' }),
      ...(primary && { background: '#0076DE', color: '#FFF' }),
      ...style,
    }}
    {...x}
  />
)
export let ButtonRadio = ({ value, onChange = () => {}, options }) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      x => (
        <Button
          key={x.value}
          isActive={x.value === value}
          onClick={() => onChange(x.value)}
        >
          {x.label}
        </Button>
      ),
      options
    )}
  </Flex>
)

// Lifted from demo theme to prevent codependency
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

export let Adder = ModalFilterAdder({
  Button,
  Input,
  Highlight,
  Item: ListGroupItem,
})

export let PagerItem = withStateLens({ hovering: false })(
  observer(({ active, hovering, disabled, ...x }) => (
    <span
      style={{
        padding: '5px',
        background: (F.view(hovering) || disabled) ? '#f5f5f5' : 'white',
        border: '2px solid #EDEDED',
        borderRadius: '4px',
        ...(active && {
          fontWeight: 'bold',
          borderColor: '#0076DE',
          color: '#0076DE',
        }),
        ...(disabled && {
          pointerEvents: 'none'
        }),
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...hover(hovering)}
      {...x}
    />
  ))
)

export let ExampleTypes = ExampleTypeConstructor({
  Input,
  Checkbox,
  RadioList: ButtonRadio,
  Table,
})
export let Pager = partial({ Item: PagerItem }, ExampleTypes.ResultPager)
