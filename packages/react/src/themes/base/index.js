import F from 'futil-js'
import React from 'react'
import { defaultProps } from 'recompose'

// components exported from base component library
import BarChart from '../../greyVest/BarChart'
import CheckButton from '../../greyVest/CheckButton'
import ExpandableTable from '../../greyVest/ExpandableTable'
import Modal from '../../greyVest/Modal'
import ModalPicker from '../../greyVest/ModalPicker'
import NestedPicker from '../../greyVest/NestedPicker'
import Popover from '../../greyVest/Popover'
import RadioList from '../../greyVest/RadioList'
import Select from '../../greyVest/Select'
import TagsInput from '../../greyVest/TagsInput'
import Tag from '../../greyVest/Tag'
import TextHighlight from '../../greyVest/TextHighlight'
import DateInput from '../../greyVest/DateInput'

// components used only for base theme
import Icon from './Icon'
import MissingTypeComponent from './MissingTypeComponent'
import TableHeaderCell from './TableHeaderCell'

import { defaultTheme } from '../../utils/theme'

let theme = {
  BarChart,
  Box: 'div',
  Button: 'button',
  Checkbox: props => <input type="checkbox" {...props} />,
  CheckButton,
  DateInput: defaultProps({ native: true })(DateInput),
  MissingTypeComponent,
  ExpandableTable,
  Icon,
  Input: 'input',
  ListItem: 'li',
  Modal,
  ModalPicker,
  NumberInput: props => <input type="number" {...props} />,
  Picker: NestedPicker,
  PagerItem: ({ children }) => <span>{children}</span>,
  PickerItem: 'div',
  Popover,
  RadioList: defaultProps({ native: true })(RadioList),
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
