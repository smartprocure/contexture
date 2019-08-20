import React from 'react'
import { defaultProps } from 'recompose'
import { Flex, Tag } from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
export { AccordionStep, StepsAccordion, TagsInput } from '../../layout'
export { FilterList } from '../../'
export { default as QueryBuilder } from '../../queryBuilder'
export { default as QueryWizard } from '../../queryWizard'

import AdderPicker from './AdderPicker'
export { default as Box } from './Box'
import Button from './Button'
export { default as ButtonRadio } from './ButtonRadio'
import Checkbox from './Checkbox'
import CheckButton from './CheckButton'
export { default as CheckboxList } from './CheckboxList'
import DateInput from './DateInput'
export { default as ErrorList } from './ErrorList'
export { default as ErrorText } from './ErrorText'
export { default as FilterButtonList } from './FilterButtonList'
import FilterListItem from './FilterListItem'
import Fonts from './Fonts'
import Icon from './Icon'
export { default as IconButton } from './IconButton'
import TextInput from './TextInput'
export { default as LinkButton } from './LinkButton'
import ListItem from './ListItem'
import Modal from './Modal'
import PagerItem from './PagerItem'
import RadioList from './RadioList'
export { default as Select } from './Select'
import Style from './style'
import Table from './Table'
export { default as TabList } from './TabList'
export { Tab, TabContent, TabLabel, Tabs } from './Tabs'
export { default as Textarea } from './Textarea'
import TextHighlight from './TextHighlight'
export { default as ToggleFiltersButton } from './ToggleFiltersButton'
export { default as ToggleFiltersHeader } from './ToggleFiltersHeader'
export { default as TreePauseButton } from './TreePauseButton'

let baseTheme = {
  AdderPicker,
  Button,
  Checkbox,
  CheckButton,
  Fonts,
  Icon,
  TextInput,
  ListItem,
  PickerItem: FilterListItem,
  Modal,
  PagerItem,
  Style,
  Table,
  Tag,
  TextHighlight,
}

let SearchTree = () => {}
let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)

export {
  AdderPicker,
  Button,
  ButtonGroup,
  Checkbox,
  CheckButton,
  DateInput,
  Fonts,
  TextInput,
  ListItem,
  Modal,
  PagerItem,
  RadioList,
  SearchTree,
  Style as GVStyle,
  Table,
  TextHighlight,
}

// this should all be removed after ExampleTypes refactored to use the theme API

export let ExampleTypes = ExampleTypeConstructor(baseTheme)
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

export default { ...baseTheme, Pager, PagedResultTable, ...ExampleTypes }
