import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { defaultProps } from 'recompose'
import { withStateLens } from '../../utils/mobx-react-utils'
import InjectTreeNode from '../../utils/injectTreeNode'
import {
  Flex,
  TextHighlight,
  NestedPicker,
  ModalFilterAdder,
  Tag,
  TagsInput as BaseTagsInput,
  FilterList as BaseFilterList,
  Dynamic,
} from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
import QueryBuilderComponent from '../../queryBuilder'
import DatePicker from 'react-date-picker'

import Input from './Input'
import Checkbox from './Checkbox'
import Textarea from './Textarea'
import Select from './Select'
import CheckboxList from './CheckboxList'
import RadioList from './RadioList'
import Fonts from './Fonts'
import IconButton from './IconButton'
import Table from './Table'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import Tabs from './TabList'
import ErrorList from './ErrorList'
import ErrorText from './ErrorText'

export {
  Input,
  Checkbox,
  Textarea,
  Select,
  CheckboxList,
  RadioList,
  Fonts,
  IconButton,
  Table,
  Button,
  ButtonRadio,
  Tabs,
  ErrorList,
}

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
        padding: 11px 22px 12px 22px;
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
      .gv-link-button {
        /* Same as a contexture-themed link */
        color: #0076DE;
        background-color: transparent;
        border: none;
        cursor: pointer;
        text-decoration: underline;
        display: inline;
        margin: 0;
        padding: 0;
      }
      .gv-link-button:hover,
      .gv-link-button:focus {
        text-decoration: none;
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

      input.gv-input, textarea.gv-input {
        padding: 10px;
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


      /* Radio Buttons */
      .gv-radio {
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        border: 2px solid #EDEDED;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .gv-radio-dot.active {
        width: 14px;
        height: 14px;
        background: #007AFF;
        border-radius: 50%;
      }
      .gv-radio-label {
        padding-left: 10px;
      }
      .gv-radio-option {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 25px;
      }
      .gv-radio-list {
        display: flex;
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
      .gv-body .tags-input input {
        /* 7/8px is for 15px between tags and border */
        margin-left: 8px;
        margin-right: 7px;
        margin-top: 8px;
        margin-bottom: 7px;
        /* To reach perfect 40px, remove real input padding because we have it on the fake one */
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
      }
      .gv-body .tags-input-tag {
        /* Arbitrary theme design */
        margin-left: 8px;
        margin-right: 7px;
        border-radius: 2px;
        padding: 5px 13px 7px 15px;
        font-size: 15px;
      }
      .gv-body .tags-input-tag-remove {
        /* Arbitrary theme design */
        padding-left: 10px;
        font-size: 13px;
        vertical-align: middle;
      }

      /* Tags Popover */
      .gv-body .tags-input-popover {
        /* counteract default popover padding */
        margin: -5px;
      }
      .gv-body .tags-input-popover > div {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding: 15px;
      }
      .gv-body .tags-input-popover .popover-item:first-child {
        padding-top: 0;
      }
      .gv-body .tags-input-popover .popover-item {
        padding-top: 10px;
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
        padding: 5px;
        cursor: pointer;
        color: #9b9b9b;
        display: inline-block;
        transition: background-color .1s linear, color .1s linear;
      }
      .gv-icon-button > * {
        vertical-align: middle;
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
        padding: 15px;
        background-color: #fff;
      }
      .gv-search-toolbar .gv-icon-button {
        margin-right: 5px;
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

      .contexture-number-separator {
        margin: 0 10px;
      }
      .contexture-number-best-range {
        margin-top: 15px;
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
      .filter-field-has-value {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-icon-button {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-icon-button:hover {
        color: #f6f6f6;
        background-color: #0076de;
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

      .gv-body .labeled-checkbox {
        display: flex;
      }
      .gv-body .labeled-checkbox > span {
        padding-left: 10px;
      }

      /* Reset to standard */
      .react-date-picker * {
        font-size: 16px;
      }
      .react-date-picker abbr {
        text-decoration-line: none;
        font-size: 11px;
      }
      .react-date-picker, .react-date-picker__wrapper {
        width: 100%;
      }
      .react-date-picker__wrapper {
        border: 2px solid #ededed!important;
        border-radius: 4px;
      }
      .react-date-picker__inputGroup__input {
        min-width: 20px!important;
        text-align: center;
        border: none!important;
      }
      .react-date-picker__inputGroup__input::placeholder {
        opacity: 0.5;
      }
      .react-date-picker__inputGroup__year {
        min-width: 40px!important;
      }
      .react-calendar__month-view__days__day--weekend {
        color: #000;
      }
      .react-calendar__month-view__days__day--neighboringMonth {
        color: #969696;
      }
      .react-calendar__navigation {
        margin-bottom: 0;
      }
      /* GV BOX it up */
      .react-calendar {
        border: 2px solid #ededed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
        width: 400px !important;
      }

      /* Modals */
      .default-modal-wrap {
        width: auto;
        max-width: 640px;
        border: 30px solid white;
        overflow-x: auto;
      }
    `}
  </style>
)

// Lifted from demo theme to prevent codependency
export let Highlight = ({ style = {}, ...x }) => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow', ...style }} {...x} />}
    {...x}
  />
)

export let ListItem = withStateLens({ hovering: false })(
  observer(({ hovering, style = {}, ...x }) => (
    <div
      style={{
        cursor: 'pointer',
        padding: '2.5px 5px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        color: 'initial',
        ...(F.view(hovering) && { color: '#0076de' }),
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...x}
    />
  ))
)
ListItem.displayName = 'ListItem'

export let ListGroupItem = props => (
  <ListItem
    style={{
      display: 'grid',
      gridGap: '5px',
      gridTemplateColumns: '20px 1fr',
      alignItems: 'center',
    }}
    {...props}
  />
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
  Refresh: () => (
    <IconButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
    >
      <SmallIcon icon="refresh" />
    </IconButton>
  ),
}
let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon]} {...props} />
)

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

let TagComponent = defaultProps({
  removeIcon: <span className="tags-input-tag-remove fa fa-times" />,
})(Tag)
export let TagsInput = defaultProps({ TagComponent })(BaseTagsInput)

export let ExampleTypes = ExampleTypeConstructor({
  Button,
  Input,
  Checkbox,
  RadioList,
  Table,
  FieldPicker: defaultProps({ Input, Highlight, Item: FilterListItem })(
    NestedPicker
  ),
  ListGroupItem,
  TagsInput,
  Icon,
  DateInput: defaultProps({
    calendarType: 'US',
    calendarIcon: null,
    clearIcon: null,
  })(DatePicker),
})
export let Pager = props => (
  <ExampleTypes.ResultPager
    Item={PagerItem}
    {...props}
    className="gv-pager gv-box"
  />
)

export let MissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <ErrorText>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </ErrorText>
))
export let FilterList = defaultProps({ Icon, ListItem, MissingTypeComponent })(
  BaseFilterList
)

export let QueryBuilder = defaultProps({ Button })(QueryBuilderComponent)
