import F from 'futil-js'
import Awaiter from './Awaiter'
import BarChart from './BarChart'
import Checkbox from './Checkbox'
import CheckButton from './CheckButton'
import DefaultIcon from '../DefaultIcon'
import Dynamic from './Dynamic'
import ExpandableTable from './ExpandableTable'
import Flex from './Flex'
import Grid from './Grid'
import LensInput from './LensInput'
import Modal from './Modal'
import ModalPicker from './ModalPicker'
import NestedPicker from './NestedPicker'
import Popover from './Popover'
import Portal from './Portal'
import RemoveTagIcon from './RemoveTagIcon'
import SpacedList from './SpacedList'
import StepsAccordion, { AccordionStep } from './StepsAccordion'
import { Tag, TagsInput } from './TagsInput'
import TextHighlight from './TextHighlight'

import { defaultTheme } from '../utils/theme'

let theme = {
  AdderPicker: ModalPicker,
  BarChart,
  Button: 'button',
  Checkbox,
  CheckButton,
  ExpandableTable,
  Icon: DefaultIcon,
  Input: 'input',
  ListItem: 'li',
  LensInput,
  Modal,
  Picker: NestedPicker,
  PickerItem: 'div',
  Popover,
  PopoverContents: 'div',
  RemoveTagIcon,
  SpacedList,
  Table: 'table',
  Tag,
  TagComponent: Tag,
  TagsInput,
  TextHighlight,
  HighlightWrap: 'i',
}
F.mergeOn(defaultTheme, theme)
export default theme

// components
export {
  AccordionStep,
  Awaiter,
  BarChart,
  Checkbox,
  CheckButton,
  Dynamic,
  ExpandableTable,
  Flex,
  Grid,
  LensInput,
  Modal,
  ModalPicker,
  NestedPicker,
  Popover,
  Portal,
  SpacedList,
  StepsAccordion,
  Tag,
  TagsInput,
  TextHighlight,
}
