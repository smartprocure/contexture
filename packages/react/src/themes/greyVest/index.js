import React from 'react'
import { defaultProps } from 'recompose'
import { Flex, Tag } from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
export {
  AccordionStep,
  StepsAccordion,
  TagsInput,
} from '../../layout'
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
import Fonts from './Fonts'
import HighlightWrap from './HighlightWrap'
import Icon from './Icon'
export { default as IconButton } from './IconButton' 
import Input from './Input'
export { default as LinkButton } from './LinkButton' 
import ListGroupItem from './ListGroupItem'
export { default as ListItem } from './ListItem' 
import Modal from './Modal'
import PagerItem from './PagerItem'
import RadioList from './RadioList'
import RemoveTagIcon from './RemoveTagIcon'
export { default as SearchFilters, FiltersBox, AddableFilterList } from './SearchFilters' 
export { default as SearchLayout } from './SearchLayout' 
export { default as Select } from './Select' 
import Style from './style'
import Table from './Table'
export { default as TabList } from './TabList' 
export { Tabs, Tab, TabContent, TabLabel } from './Tabs'
export { default as Textarea } from './Textarea' 
export { default as ToggleFiltersButton } from './ToggleFiltersButton' 
export { default as ToggleFiltersHeader } from './ToggleFiltersHeader' 
export { default as TreePauseButton } from './TreePauseButton' 

export default {
  AdderPicker,
  Button,
  Checkbox,
  CheckButton,
  Fonts,
  HighlightWrap,
  Icon,
  Input,
  ListItem: ListGroupItem,
  Modal,
  PagerItem,
  RemoveTagIcon,
  Style,
  Table,
  Tag,
  TagComponent: Tag,
}

let SearchTree = () => {}
let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)

export {
  AdderPicker as Adder,
  Button,
  Checkbox,
  CheckButton,
  Fonts,
  HighlightWrap as Wrap,
  Input,
  ListGroupItem,
  Modal,
  PagerItem,
  RadioList,
  SearchTree,
  Style as GVStyle,
  Table,
}

// this should all be removed after ExampleTypes refactored to use the theme API

export let ExampleTypes = ExampleTypeConstructor({
  Button,
  Input,
  Checkbox,
  RadioList,
  Table,
  ListGroupItem,
  Icon,
  DateInput,
  ButtonGroup,
  PagerItem,
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
