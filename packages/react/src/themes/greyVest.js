import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { partial, withStateLens } from '../utils/mobx-react-utils'
import {
  Flex,
  TextHighlight,
  FilteredPicker,
  ModalFilterAdder,
  TagsInput,
  FilterList as BaseFilterList
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
    className="gv-input"
    style={{
      height: '20px',
      width: '20px',
      borderRadius: '3px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2px',
      cursor: 'pointer',
      ...checked ? {backgroundColor: '#ebebeb'} : {},
      ...style,
    }}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? <i className="material-icons"
    style={{
      fontSize: 14,
      fontWeight: 'bold',
    }}>check</i> : String.fromCharCode(160)}
  </label>
)

export let Fonts = () => (
  <div>
    <link
      href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
      integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
      crossOrigin="anonymous"
    />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet" />
    
  </div>
)

export let IconButton = ({className, primary, ...props}) => 
  <div
    className={`gv-icon-button ${className || ''} ${primary ? 'primary' : ''}`}
    {...props}
  />

export default IconButton

export let GVStyle = () => (
  <style>
    {`
      h1 {
        font-family: Lato;
        font-size: 20px;
        font-weight: bold;
        line-height: 1.3;
        letter-spacing: 3px;
        text-transform: uppercase;
        /*font-size: 22px;*/
        margin: 30px 0;
      }
      
      /* Button */
      .gv-button {
        padding: 11px 22px 12px 25px;
        border-radius: 3px;
        background-color: #e3e5e6;
      
        border: none;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        /* margin 5px ????? */
      }
      .gv-button.active, .gv-button.primary {
        background-color: #0076de;
        color: #fff;
      }

      
      /* Table */
      .gv-table {
        border-collapse: collapse;
        width: 100%;
      }
      .gv-table tbody tr {
        border-bottom: solid 2px rgba(237, 237, 237, 0.43);
      }
      .gv-table td, .gv-table th {
        padding: 20px;
        text-align: left;
      }
      .gv-table th > span {
        display: flex;
        align-items: center;
      }
      
      .gv-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
      }
      
      .gv-body, body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 16px;
        color: #454545;
      }
      
      .gv-input, .gv-body select, .gv-body input {
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
        box-sizing: border-box;
        margin: 5px auto;
        background: #fff;
        /* Arbitrary theme design */
        padding: 15px;
      }
      /* To reach perfect 40px, remove real input padding because we have it on the fake one */
      .gv-body .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
        /* Arbitrary theme design */
        padding-left: 7px;
      }
      .gv-body .tags-input-tag {
        margin: 0 2px;
        /* Arbitrary theme design */
        border-radius: 2px;
        padding: 5px 13px 7px 15px;
        font-size: 15px;
      }
      .gv-body .tags-input-tag-remove {
        /* Arbitrary theme design */
        padding-left: 8px;
        font-size: 10px;
      }
      
      /* Pager */
      .gv-pager {
        position: relative;
        top: 50px;
      }
      .gv-pager-item {
        padding: 5px;
        width: 30px;
        background: white;
        border-radius: 2px;
        cursor: pointer;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        margin: 0 2.5px;
      }
      .gv-pager-item:hover, .gv-pager-item.disabled {
         background: #f5f5f5;
      }
      .gv-pager-item.active {
        background-color: #0076de;
        color: #fff;
      }
      .gv-pager-item.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
      
      /* Icon Button */
      .gv-icon-button {
        border-radius: 100px;
        width: 20px;
        height: 20px;
        padding: 5px;
        cursor: pointer;
        color: #9b9b9b;
        display: inline-block;
        transition: background-color .1s linear, color .1s linear;
      }
      .gv-icon-button i {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
      .gv-icon-button:hover {
        background-color: rgba(216, 216, 216, 0.4);
        color: #000;
      }
      .gv-icon-button.active, .gv-icon-button.primary {
        background-color: #0076de;
        color: #fff;
      }
      

      /* Button Group Border Radii */
      .gv-button-group {
        border-radius: 3px;
        display: flex;
        overflow: hidden;
      }
      .gv-button-group > :first-child {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      .gv-button-group > :last-child {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
      
      
      /* Search Bar + Button */
      .gv-search-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-gap: 30px;
        position: sticky;
        top: 5px;
        /*background: #f6f6f6;*/
      }
      .gv-search-bar .gv-box {
        padding: 0;
      }
      .gv-search-bar > .gv-button-group {
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
      }
      .gv-search-bar .tags-input {
        margin: 0;
        border: none;
      }
      .gv-search-button {
        font-size: 18px;
      }
      .gv-search-toolbar {
        display: flex;
        align-items: center;
        padding: 15px 30px;
      }
      .gv-search-toolbar .gv-icon-button {
        margin-right: 20px;
      }
      .gv-search-toolbar .gv-icon-button:last-child {
        margin-right: 0;
      }
      
      
      .contexture-facet a {
        color: #0076de
      }
      .contexture-facet {
        font-size: 14px;
      }
      
      /* Tabs */     
      .gv-tab-container .gv-tab {
        display: inline-block;
        padding: 15px 40px 16px 40px;
        background-color: #e0e0e3;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        vertical-align: bottom;
        border-left: solid 1px #c4c5ca;
        transition: background-color 0.1s linear;
      }
      .gv-tab.active + .gv-tab {
        border-left: none;
      }
      .gv-tab:last-child {
        border-radius: 0 4px 0 0;
      }
      .gv-tab:first-child {
        border-radius: 4px 0 0 0;
        border-left: none;
      }
      .gv-tab.active, .gv-tab.active:hover {
        background-color: #fff;
        font-size: 18px;
        padding: 22px 40px 23px 40px;
        border-radius: 4px 4px 0 0 !important;
        /* white box shadow trick from http://dev.housetrip.com/2012/06/15/good-looking-css-tabs/ */
        box-shadow: 0 10px 0 0 #fff, 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        border-left: none;
      }
      .gv-tab:hover {
        background-color: rgba(147,149,160, 0.5);
      }
      
      
      /* Filter List */
      .filter-list.gv-box {
        padding: 30px;
      }
      .filter-list-item {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding-bottom: 30px;
        margin-bottom: 30px;
        margin-left: -30px;
        margin-right: -30px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .filter-field-label {
        font-size: 18px;
        font-weight: bold;
      }
      .filter-field-label-icon {
        color: #9b9b9b;
      }
      
      .filter-list-item-contents {
        margin-top: 15px
      }
      
      .gv-grid {
        display: grid;
        grid-template-columns: 1fr 4fr;
        grid-gap: 40px;
        margin: 0 40px;
      }
      
      .popover {
        border-radius: 3px;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        border: solid 1px #f1f1f1;
        padding: 5px;
      }
    `}
  </style>
)
export let Table = x => <table className="gv-table" {...x} />

export let Button = ({
  isActive,
  primary,
  as: As = 'button',
  className,
  ...x
}) => (
  <As
    className={`gv-button ${isActive ? 'active' : ''} ${primary ? 'primary' : ''} ${className || ''}`}
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
export let ListGroupItem = withStateLens({ hovering: false })(
  observer(({ hovering, ...x }) => (
    <div
      style={{
        cursor: 'pointer',
        padding: '2.5px 5px',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: '20px 1fr',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        fontSize: 13,
        ...(F.view(hovering) && { color: '#0076de' }),
      }}
      {...F.domLens.hover(hovering)}
      {...x}
    />
  ))
)


let SmallIcon = ({icon}) => <i className="material-icons" style={{fontSize:20}}>{icon}</i>
let iconMap = {
  SortAscending:  () => <SmallIcon icon="expand_less" />,
  SortDescending:  () => <SmallIcon icon="expand_more" />,
  MoveLeft:  () => <SmallIcon icon="chevron_left" />,
  MoveRight:  () => <SmallIcon icon="chevron_right" />,
  RemoveColumn:  () => <SmallIcon icon="remove" />,
  AddColumn:  () => <SmallIcon icon="add" />,
  FilterExpand:  () => <SmallIcon icon="filter_list" />,
  FilterCollapse:  () => <SmallIcon icon="filter_list" />,
  FilterAdd:  () => <SmallIcon icon="filter_list" />,
  TableColumnMenu:  () => <IconButton><SmallIcon icon="more_vert" /></IconButton>,
  FilterListExpand:  () => <SmallIcon icon="add" />,
  FilterListCollapse:  () => <SmallIcon icon="remove" />,
}
let Icon = ({ icon }) => {
  let C = iconMap[icon]
  return C ? <C /> : null
}

export let Adder = ModalFilterAdder({
  Button,
  Input,
  Highlight,
  Item: ListGroupItem,
  label: (
    <span
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      Add Custom Filter
      <i className="material-icons" style={{opacity: 0.4}}>
        filter_list
      </i>
    </span>
  ),
})

export let PagerItem =
  observer(
    ({ active, disabled, ...x }) =>
      <span
        className={
          `gv-pager-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`
        }
      {...x}
    />
  )
  

let TagComponent = ({ value, removeTag, tagStyle }) => (
  <div className="tags-input-tag" style={tagStyle}>
    {value}
    <span
      className="tags-input-tag-remove fa fa-times"
      style={{ cursor: 'pointer' }}
      onClick={() => removeTag(value)}
    />
  </div>
)


export let ExampleTypes = ExampleTypeConstructor({
  Button,
  Input,
  Checkbox,
  RadioList: ButtonRadio,
  Table,
  FieldPicker: partial(
    { Input, Highlight, Item: ListGroupItem },
    FilteredPicker
  ),
  ListGroupItem,
  TagsInput: partial({ TagComponent }, TagsInput),
  Icon
})
export let Pager = props => <div className='gv-pager gv-box'>
  <ExampleTypes.ResultPager Item={PagerItem} {...props} />
</div>


let Tabs = ({value, onChange = () => {}, options}) => (
  <div className='gv-tab-container'>
    {_.map(
      x => (
        <div
          key={x.value}
          className={`gv-tab ${x.value === value ? 'active' : ''}`}
          onClick={() => onChange(x.value)}>
          {x.label}
        </div>
      ),
      options
    )}
  </div>
)
Tabs.displayName = 'Tabs'
Tabs = observer(Tabs)
export { Tabs }

export let FilterList = partial({ Icon }, BaseFilterList)