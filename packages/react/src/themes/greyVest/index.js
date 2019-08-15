import React from 'react'
import { defaultProps } from 'recompose'
import {
  Flex,
  Tag,
  CheckButton as BaseCheckButton,
  TagsInput as BaseTagsInput,
  FilterList as BaseFilterList,
  FilterButtonList as BaseFilterButtonList,
} from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
import {
  StepsAccordion as DefaultStepsAccordion,
  AccordionStep,
} from '../../layout'

import AdderPicker from './AdderPicker'
import Box from './Box'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import Checkbox from './Checkbox'
import CheckboxList from './CheckboxList'
import DateInput from './DateInput'
import ErrorList from './ErrorList'
import ErrorText from './ErrorText'
import Fonts from './Fonts'
import HighlightWrap from './HighlightWrap'
import Icon from './Icon'
import IconButton from './IconButton'
import Input from './Input'
import LinkButton from './LinkButton'
import ListGroupItem from './ListGroupItem'
import ListItem from './ListItem'
import Modal from './Modal'
import PagerItem from './PagerItem'
import RadioList from './RadioList'
import SearchFilters, { FiltersBox, AddableFilterList } from './SearchFilters'
import SearchLayout from './SearchLayout'
import Select from './Select'
import Style from './style'
import Table from './Table'
import TabList from './TabList'
import { Tabs, Tab, TabContent, TabLabel } from './Tabs'
import Textarea from './Textarea'
import ToggleFiltersButton from './ToggleFiltersButton'
import ToggleFiltersHeader from './ToggleFiltersHeader'
import TreePauseButton from './TreePauseButton'

let CheckButton = props => <BaseCheckButton className="gv-checkbutton" {...props} />
let RemoveTagIcon = props => <span className="tags-input-tag-remove fa fa-times" {...props} />

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
let Pager = props => (
  <ExampleTypes.ResultPager
    Item={PagerItem}
    {...props}
    className="gv-pager gv-box"
  />
)
let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ExampleTypes.ResultTable {...{ tree, node, path, ...props }} />
    <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
      <Pager {...{ tree, node, path }} />
    </Flex>
  </>
)
PagedResultTable.displayName = 'PagedResultTable'

let SearchTree = () => {}
let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)
let FilterButtonList = defaultProps({ className: 'gv-filter-button-list' })(BaseFilterButtonList)

export {
  AccordionStep,
  AddableFilterList,
  AdderPicker as Adder,
  BaseFilterList as FilterList,
  BaseTagsInput as TagsInput,
  Box,
  Button,
  ButtonRadio,
  Checkbox,
  CheckboxList,
  CheckButton,
  DefaultStepsAccordion as StepsAccordion,
  ErrorList,
  ErrorText,
  FilterButtonList,
  FiltersBox,
  Fonts,
  HighlightWrap as Wrap,
  IconButton,
  Input,
  LinkButton,
  ListGroupItem,
  ListItem,
  Modal,
  PagedResultTable,
  Pager,
  PagerItem,
  RadioList,
  SearchFilters,
  SearchLayout,
  SearchTree,
  Select,
  Style as GVStyle,
  Table,
  TabContent,
  TabLabel,
  TabList,
  Tab,
  Tabs,
  Textarea,
  ToggleFiltersButton,
  ToggleFiltersHeader,
  TreePauseButton,
}

export { default as QueryBuilder } from '../../queryBuilder'
export { default as QueryWizard } from '../../queryWizard'
