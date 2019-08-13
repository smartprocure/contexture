import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { defaultProps } from 'recompose'
import { useLens } from '../../utils/react'
import { withNode } from '../../utils/hoc'
import {
  Flex,
  TextHighlight,
  NestedPicker,
  ModalFilterAdder,
  Tag,
  TagsInput as BaseTagsInput,
  FilterList as BaseFilterList,
  FilterButtonList as BaseFilterButtonList,
  Dynamic,
} from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
import QueryBuilderComponent from '../../queryBuilder'
import QueryWizardComponent from '../../queryWizard'
import {
  Modal as DefaultModal,
  CheckButton as DefaultCheckButton,
  StepsAccordion as DefaultStepsAccordion,
  AccordionStep,
} from '../../layout'

export { default as GVStyle } from './style'

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
import TabList from './TabList'
export { Tabs, Tab, TabContent, TabLabel } from './Tabs'
import ErrorList from './ErrorList'
import ErrorText from './ErrorText'
import Box from './Box'
import LinkButton from './LinkButton'
import TreePauseButton from './TreePauseButton'
import ToggleFiltersButton from './ToggleFiltersButton'
import ToggleFiltersHeader from './ToggleFiltersHeader'
export { default as SearchLayout } from './SearchLayout'
import BaseSearchFilters from './SearchFilters'
import DateInput from './DateInput'

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
  TabList,
  ErrorList,
  Box,
  LinkButton,
  TreePauseButton,
  ToggleFiltersButton,
  ToggleFiltersHeader,
  AccordionStep,
}

export let SearchTree = () => {}

// Lifted from demo theme to prevent codependency
export let Highlight = ({ style = {}, ...props }) => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow', ...style }} {...x} />}
    {...props}
  />
)

export let ListItem = observer(({ style = {}, ...props }) => {
  let hovering = useLens(false)
  return (
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
      {...props}
    />
  )
})
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

let CheckButtonButton = props => (
  <Button className="gv-checkbutton" {...props} />
)
export let CheckButton = defaultProps({ Checkbox, Button: CheckButtonButton })(
  DefaultCheckButton
)

export let Modal = defaultProps({ className: 'gv-body' })(DefaultModal)
export let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)
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
  RemoveIcon: props => (
    <span className="tags-input-tag-remove fa fa-times" {...props} />
  ),
})(Tag)
export let TagsInput = defaultProps({ TagComponent })(BaseTagsInput)

let FieldPicker = defaultProps({
  Input,
  Highlight,
  Item: FilterListItem,
})(NestedPicker)

export let ExampleTypes = ExampleTypeConstructor({
  Button,
  Input,
  Checkbox,
  RadioList,
  Table,
  FieldPicker,
  ListGroupItem,
  TagsInput,
  Icon,
  DateInput,
  ButtonGroup,
})
export let Pager = props => (
  <ExampleTypes.ResultPager
    Item={PagerItem}
    {...props}
    className="gv-pager gv-box"
  />
)

export let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ExampleTypes.ResultTable {...{ tree, node, path, ...props }} />
    <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
      <Pager {...{ tree, node, path }} />
    </Flex>
  </>
)
PagedResultTable.displayName = 'PagedResultTable'

export let MissingTypeComponent = withNode(({ node = {} }) => (
  // Min Height here is to align better in QueryBuilder
  <Flex style={{ minHeight: '40px', alignItems: 'center' }}>
    <ErrorText>
      Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
    </ErrorText>
  </Flex>
))

export let FilterList = defaultProps({
  Icon,
  ListItem,
  MissingTypeComponent,
  Picker: FieldPicker,
})(BaseFilterList)

export let AddableFilterList = props => (
  <>
    <FilterList {...props} />
    <Adder {...props} uniqueFields />
  </>
)

export let FiltersBox = props => (
  <div className="gv-box filter-list">
    <AddableFilterList {...props} />
  </div>
)

export let QueryBuilder = defaultProps({
  Button,
  MissingTypeComponent,
  Picker: FieldPicker,
})(QueryBuilderComponent)

export let SearchFilters = defaultProps({ QueryBuilder, FiltersBox })(
  BaseSearchFilters
)

export let FilterButtonList = defaultProps({
  Button,
  CheckButton,
  Icon,
  Modal,
  className: 'gv-filter-button-list',
})(BaseFilterButtonList)

export let StepsAccordion = defaultProps({
  Button,
  Icon,
  className: 'gv-steps-accordion',
})(DefaultStepsAccordion)

export let QueryWizard = defaultProps({
  StepsAccordion,
  FilterButtonList,
  CheckButton,
  Modal,
  Button,
  Icon,
})(QueryWizardComponent)
