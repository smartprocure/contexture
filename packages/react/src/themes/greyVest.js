import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { defaultProps } from 'recompose'
import { withStateLens } from '../utils/mobx-react-utils'
import {
  Flex,
  TextHighlight,
  NestedPicker,
  ModalFilterAdder,
  TagsInput,
  FilterList as BaseFilterList,
  Dynamic,
} from '../'
import DefaultSelect from '../layout/Select'
import RadioList from '../layout/RadioList'
import ExampleTypeConstructor from '../exampleTypes/'
import QueryBuilderComponent from '../queryBuilder'

export let Input = ({ className = '', style, type = 'text', ...x }) => (
  <input
    className={`${className} gv-input`}
    style={{
      ...style,
    }}
    type={type}
    {...x}
  />
)

// Low effort custom checkbox
export let Checkbox = ({ checked, onChange, style = {} }) => (
  <label
    className="gv-input gv-checkbox"
    style={{
      height: '20px',
      width: '20px',
      borderRadius: '3px',
      display: 'flex',
      justifyContent: 'center',
      cursor: 'pointer',
      ...(checked ? { backgroundColor: '#ebebeb' } : {}),
      ...style,
    }}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      {...{ checked, onChange }}
    />
    {checked ? (
      <i
        className="material-icons"
        style={{
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        check
      </i>
    ) : (
      String.fromCharCode(160)
    )}
  </label>
)

export let Textarea = observer(props => (
  <textarea className="gv-input" {...props} />
))
Textarea.displayName = 'Textarea'

export let Select = observer(props => (
  <DefaultSelect className="gv-input" {...props} />
))
Select.displayName = 'Select'

export let CheckboxList = observer(({ options, value, onChange, ...props }) => (
  <div {...props}>
    {_.map(
      option => (
        <label
          key={option.value}
          style={{ display: 'flex', cursor: 'pointer', marginRight: 25 }}
        >
          <Checkbox
            {...F.domLens.checkboxValues(option.value, {
              get: () => value,
              set: onChange,
            })}
          />
          <div style={{ paddingLeft: 15 }}>{option.label}</div>
        </label>
      ),
      options
    )}
  </div>
))
CheckboxList.displayName = 'CheckboxList'

export { RadioList }

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
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  </div>
)

export let IconButton = ({ className, primary, ...props }) => (
  <div
    className={`gv-icon-button ${className || ''} ${primary ? 'primary' : ''}`}
    {...props}
  />
)

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
        transition: background-color .25s linear;
      }
      .gv-button.active, .gv-button.primary {
        background-color: #0076de;
        color: #fff;
      }
      .gv-button.success {
        background-color: #5bb85b !important;
      }
      .gv-button.danger {
        background-color: #d75050 !important;
      }
      .gv-button-radio > .gv-button {
        margin-right: 20px;
      }
      .gv-button-radio > .gv-button:last-child {
        margin-right: 0;
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
      
      /* Nested Table */
      .gv-table .expanded, .gv-table .expanded + tr {
        background: rgba(237, 237, 237, 0.5)
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
      
      .gv-input[type="text"], textarea.gv-input, .gv-input[type="number"], .gv-input[type="date"] {
        padding: 5px;
        text-indent: 5px;
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
      
      .gv-body select, .gv-body input, .gv-body textarea {
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
        background: #fff;
        /* 7/8px is for 15px between tags and border */
        padding-left: 7px;
        padding-right: 8px;
        padding-top: 7px;
        padding-bottom: 8px;
      }
      .gv-body .tags-input input,
      .gv-body .tags-input-tag  {
        /* 7/8px is for 15px between tags and border */
        margin-left: 8px;
        margin-right: 7px;
        margin-top: 8px;
        margin-bottom: 7px;
      }
      /* To reach perfect 40px, remove real input padding because we have it on the fake one */
      .gv-body .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
      }
      .gv-body .tags-input-tag {
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
        color: #9b9b9b;
      }
      .gv-pager-item:hover {
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
      .contexture-result-pager {
        display: flex;
        align-items: center;
      }
      .contexture-result-pager .gv-pager-item:first-child {
        margin-right: 20px;
      }
      .contexture-result-pager .gv-pager-item:last-child {
        margin-left: 20px;
      }
      .contexture-result-pager .gv-pager-item:first-child.disabled,
      .contexture-result-pager .gv-pager-item:last-child.disabled {
        display: none;
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
        z-index: 1;
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
        background-color: #fff;
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
      .contexture-facet > label {
        margin: 5px 0;
      }
      .contexture-facet .gv-checkbox {
        margin: 0 10px;
      }
      .contexture-facet > .gv-input[type="text"] {
        margin: 20px 0;
      }
      .contexture-facet-cardinality {
        margin: 10px 0;
      }
      
      /* Tabs */     
      .gv-tab-container .gv-tab {
        display: inline-block;
        padding: 15px 20px;
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
        padding: 15px 30px;
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
        margin-top: 15px;
      }
      
      .filter-list-group {
        border-left: solid 2px;
        padding-left: 35px; /* 30 for filter-list-item + 5 space */
        margin-left: -30px;
        margin-top: -25px; /* -30 for filter-list-item + 5 space */
        padding-top: 30px;
      }

      .gv-grid {
        display: grid;
        grid-template-columns: 400px 1fr;
        grid-gap: 40px;
        margin: 0 40px;
      }
      
      .popover {
        border-radius: 3px;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        border: solid 1px #f1f1f1;
        padding: 5px;
      }
      
      .panel-tree-picker > div {
        border-right: solid 1px #eef0f1;
      }
      .panel-tree-picker > div:last-child {
        border-right: none;
      }
      
      .gv-text-error {
        color: #D75050;
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
    className={`gv-button ${isActive ? 'active' : ''} ${
      primary ? 'primary' : ''
    } ${className || ''}`}
    {...x}
  />
)

export let ButtonRadio = ({
  value,
  onChange = () => {},
  options,
  style = {},
}) => (
  <Flex className="gv-button-radio" style={{ alignItems: 'baseline' }}>
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
ListGroupItem.displayName = 'ListGroupItem'

let SmallIcon = ({ icon }) => (
  <i className="material-icons" style={{ fontSize: 20 }}>
    {icon}
  </i>
)
let iconMap = {
  SortAscending: () => <SmallIcon icon="expand_less" />,
  SortDescending: () => <SmallIcon icon="expand_more" />,
  MoveLeft: () => <SmallIcon icon="chevron_left" />,
  MoveRight: () => <SmallIcon icon="chevron_right" />,
  RemoveColumn: () => <SmallIcon icon="remove" />,
  AddColumn: () => <SmallIcon icon="add" />,
  FilterExpand: () => <SmallIcon icon="filter_list" />,
  FilterCollapse: () => <SmallIcon icon="filter_list" />,
  FilterAdd: () => <SmallIcon icon="filter_list" />,
  TableColumnMenu: () => (
    <IconButton>
      <SmallIcon icon="more_vert" />
    </IconButton>
  ),
  FilterListExpand: () => <SmallIcon icon="add" />,
  FilterListCollapse: () => <SmallIcon icon="remove" />,
  PreviousPage: () => <SmallIcon icon="chevron_left" />,
  NextPage: () => <SmallIcon icon="chevron_right" />,
  Previous5Pages: () => <span>...</span>,
  Next5Pages: () => <span>...</span>,
}
let Icon = ({ icon }) => <Dynamic component={iconMap[icon]} />

let AddLabel = (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    Add Custom Filter
    <i className="material-icons" style={{ opacity: 0.4 }}>
      filter_list
    </i>
  </Flex>
)

let FilterListItem = observer(
  ({ active, disabled, hasChildren, children, ...props }) => (
    <div
      style={{
        padding: '10px 40px',
        cursor: 'pointer',
        fontSize: 18,
        background: active ? '#ebebeb' : '#fff',
        color: disabled ? '#9b9b9b' : '#000',
      }}
      {...props}
    >
      {hasChildren ? (
        <Flex style={{ alignItems: 'center' }}>
          {children}
          <i className="material-icons" style={{ fontSize: 20 }}>
            chevron_right
          </i>
        </Flex>
      ) : (
        children
      )}
    </div>
  )
)
FilterListItem.displayName = 'FilterListItem'

export let Adder = ModalFilterAdder({
  Button,
  Input,
  Highlight,
  Item: FilterListItem,
  label: AddLabel,
})

export let PagerItem = observer(({ active, disabled, ...x }) => (
  <span
    className={`gv-pager-item ${disabled ? 'disabled' : ''} ${
      active ? 'active' : ''
    }`}
    {...x}
  />
))
PagerItem.displayName = 'PagerItem'

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
  FieldPicker: defaultProps({ Input, Highlight, Item: FilterListItem })(
    NestedPicker
  ),
  ListGroupItem,
  TagsInput: defaultProps({ TagComponent })(TagsInput),
  Icon,
})
export let Pager = props => (
  <ExampleTypes.ResultPager
    Item={PagerItem}
    {...props}
    className="gv-pager gv-box"
  />
)

let Tabs = ({ value, onChange = () => {}, options }) => (
  <div className="gv-tab-container">
    {_.map(
      x => (
        <div
          key={x.value}
          className={`gv-tab ${x.value === value ? 'active' : ''}`}
          onClick={() => onChange(x.value)}
        >
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

export let FilterList = defaultProps({ Icon })(BaseFilterList)

// Error Text / List General Components
let ErrorText = ({ children }) => (
  <div className="gv-text-error">{children}</div>
)
export let ErrorList = ({ children }) =>
  _.map(e => <ErrorText key={e}>{e}</ErrorText>, _.castArray(children))

export let QueryBuilder = defaultProps({ Button })(QueryBuilderComponent)
