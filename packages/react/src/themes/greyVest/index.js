import { defaultProps } from 'recompose'
import { Flex, Tag } from '../../'
export { AccordionStep, StepsAccordion, TagsInput } from '../../layout'
export { FilterList } from '../../'
export { default as QueryBuilder } from '../../queryBuilder'
export { default as QueryWizard } from '../../queryWizard'

import AdderPicker from './AdderPicker'
import Box from './Box'
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
import LinkButton from './LinkButton'
import ListItem from './ListItem'
import Modal from './Modal'
import PagerItem from './PagerItem'
import RadioList from './RadioList'
import Select from './Select'
import Style from './style'
import Table from './Table'
export { default as TabList } from './TabList'
export { Tab, TabContent, TabLabel, Tabs } from './Tabs'
export { default as Textarea } from './Textarea'
import TextHighlight from './TextHighlight'
export { default as ToggleFiltersButton } from './ToggleFiltersButton'
export { default as ToggleFiltersHeader } from './ToggleFiltersHeader'
export { default as TreePauseButton } from './TreePauseButton'

export default {
  AdderPicker,
  Box,
  Button,
  Checkbox,
  CheckButton,
  DateInput,
  Fonts,
  Link: LinkButton,
  Icon,
  TextInput,
  ListItem,
  PickerItem: FilterListItem,
  Modal,
  PagerItem,
  Select,
  Style,
  Table,
  Tag,
  TextHighlight,
  RadioList,
}

let SearchTree = () => {}
let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)

export {
  AdderPicker,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckButton,
  DateInput,
  Fonts,
  TextInput,
  LinkButton,
  ListItem,
  Modal,
  PagerItem,
  RadioList,
  SearchTree,
  Select,
  Style as GVStyle,
  Table,
  TextHighlight,
}
