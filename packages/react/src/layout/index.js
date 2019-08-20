import F from 'futil-js'
import React from 'react'

import DefaultIcon from '../DefaultIcon'
import MissingTypeComponent from '../DefaultMissingTypeComponent'

import Awaiter from './Awaiter'
import BarChart from './BarChart'
import Checkbox from './Checkbox'
import CheckButton from './CheckButton'
import Dynamic from './Dynamic'
import ExpandableTable from './ExpandableTable'
import Flex from './Flex'
import Grid from './Grid'
import Modal from './Modal'
import ModalPicker from './ModalPicker'
import NestedPicker from './NestedPicker'
import Popover from './Popover'
import Portal from './Portal'
import RadioList from './RadioList'
import Select from './Select'
import SpacedList from './SpacedList'
import StepsAccordion, { AccordionStep } from './StepsAccordion'
import TableHeaderCell from './TableHeaderCell'
import TagsInput from './TagsInput'
import Tag from './Tag'
import TextHighlight from './TextHighlight'
import WrappedDateInput from './WrappedDateInput'

import { defaultTheme } from '../utils/theme'

let theme = {
  AdderPicker: ModalPicker,
  BarChart,
  Box: 'div',
  Button: 'button',
  Checkbox,
  CheckButton,
  DateInput: WrappedDateInput,
  MissingTypeComponent,
  ExpandableTable,
  Icon: DefaultIcon,
  Input: 'input',
  Link: 'a',
  ListItem: 'li',
  Modal,
  NumberInput: props => <input type="number" {...props} />,
  Picker: NestedPicker,
  PagerItem: 'div',
  PickerItem: 'div',
  Popover,
  RadioList,
  Select,
  Table: 'table',
  TableCell: 'td',
  TableHeaderCell,
  TableRow: 'tr',
  Tag,
  TagsInput,
  TextHighlight,
  TextInput: 'input',
}
// To add `withTheme` components to the default theme, we have to mutate them onto
// the theme object after it's declared, because importing them into `utils/theme`
// before ThemeContext is initialized would cause dependency conflicts
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
