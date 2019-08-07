import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { useLens } from '../utils/futil'
import { defaultProps } from 'recompose'
import {
  Flex,
  TextHighlight,
  NestedPicker,
  ModalFilterAdder,
  TagsInput,
} from '../'
import ExampleTypeConstructor from '../exampleTypes/'

export let Input = ({ style = {}, ...x }) => (
  <input
    style={{
      padding: '5px',
      textIndent: '5px',
      margin: '5px auto',
      ...style,
    }}
    {...x}
  />
)
Input.displayName = 'Input'

// Low effort custom checkbox
export let Checkbox = ({ checked, onChange, style = {} }) => (
  <label
    className="bb-input"
    style={{
      height: '24px',
      width: '24px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2px',
      cursor: 'pointer',
      ...style,
    }}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? '✔' : String.fromCharCode(160)}
  </label>
)

export let Fonts = () => (
  <div>
    <link
      href="https://fonts.googleapis.com/css?family=Lato:400,600,700,900"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
      integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
      crossorigin="anonymous"
    />
  </div>
)

export let Style = () => (
  <style>
    {`
      h1 { font-size: 22px; }
      
      .bb-table {
        border-collapse: collapse;
        width: 100%;
      }
      .bb-table tbody tr {
        border-bottom: solid 2px #EDEDED;
      }
      .bb-table td, .bb-table th {
        padding: 20px;
        text-align: left;
      }
      .bb-table thead tr {
        border-bottom: solid 2px #9ABCDA;
      }
      
      .bb-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 #EDEDED;
        padding: 15px;
      }
      
      .bb-body, body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 16px;
        color: #454545;
      }
      
      .bb-input, .bb-body select, .bb-body input {
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
      
      .bb-body select, .bb-body input {
        border-radius: 4px;
      }
      .bb-body select {
        cursor: pointer;
      }
      
      .bb-body .tags-input {
        border: 2px solid #EBEBEB;
        border-radius: 4px;
        min-height: 40px;
        box-sizing: border-box;
        margin: 5px auto;
        background: #fff;
        /* Arbitrary theme design */
        padding: 7px;
      }
      /* To reach perfect 40px, remove real input padding because we have it on the fake one */
      .bb-body .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
        /* Arbitrary theme design */
        padding-left: 7px;
      }
      .bb-body .tags-input-tag {
        border-radius: 4px;
        margin: 0 2px;
        /* Arbitrary theme design */
        padding: 3px 8px 5px 6px;
        font-size: 15px;
      }
      .bb-body .tags-input-tag-remove {
        /* Arbitrary theme design */
        padding-left: 8px;
        font-size: 10px;
      }
      
      .contexture-facet a {
        color: #0076de
      }
      
      .popover {
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 #ededed;
        border: 1px solid #ebebeb;
      }
    `}
  </style>
)
export let Table = x => <table className="bb-table" {...x} />

export let Button = ({
  isActive,
  primary,
  style = {},
  as: As = 'button',
  ...x
}) => (
  <As
    className="bb-input"
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
export let ButtonRadio = ({
  value,
  onChange = () => {},
  options,
  style = {},
}) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      x => (
        <Button
          key={x.value}
          isActive={x.value === value}
          onClick={() => onChange(x.value)}
          style={style}
        >
          {x.label}
        </Button>
      ),
      options
    )}
  </Flex>
)

// Lifted from demo theme to prevent codependency
export let Highlight = ({ style = {}, ...x }) => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow', ...style }} {...x} />}
    {...x}
  />
)

export let ListGroupItem = observer(props => {
  let hovering = useLens(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: '20px 1fr',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
})

export let Adder = ModalFilterAdder({
  Button,
  Input,
  Highlight,
  Item: ListGroupItem,
})

export let PagerItem = observer(({ active, disabled, style = {}, ...props }) => {
  let hovering = useLens(false)
  return (
    <span
      style={{
        padding: '5px',
        background: F.view(hovering) || disabled ? '#f5f5f5' : 'white',
        border: '2px solid #EDEDED',
        borderRadius: '4px',
        ...(active && {
          fontWeight: 'bold',
          borderColor: '#0076DE',
          color: '#0076DE',
        }),
        ...(disabled && {
          pointerEvents: 'none',
        }),
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
})

let TagComponent = observer(({ value, removeTag, tagStyle, onClick }) => (
  <div
    className="tags-input-tag"
    style={F.callOrReturn(tagStyle, value)}
    onClick={onClick}
  >
    {value}
    <span
      className="tags-input-tag-remove fa fa-times"
      onClick={() => removeTag(value)}
    />
  </div>
))
TagComponent.displayName = 'TagComponent'

export let ExampleTypes = ExampleTypeConstructor({
  Button,
  Input,
  Checkbox,
  RadioList: ButtonRadio,
  Table,
  FieldPicker: defaultProps({ Input, Highlight, Item: ListGroupItem })(
    NestedPicker
  ),
  ListGroupItem,
  TagsInput: defaultProps({ TagComponent })(TagsInput),
})

export let Pager = defaultProps({ Item: PagerItem })(ExampleTypes.ResultPager)
