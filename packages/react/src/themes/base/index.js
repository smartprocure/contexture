import F from 'futil-js'
import React from 'react'

// components exported from base component library
import BarChart from '../../layout/BarChart'
import CheckButton from '../../layout/CheckButton'
import ExpandableTable from '../../layout/ExpandableTable'
import Modal from '../../layout/Modal'
import ModalPicker from '../../layout/ModalPicker'
import NestedPicker from '../../layout/NestedPicker'
import Popover from '../../layout/Popover'
import RadioList from '../../layout/RadioList'
import Select from '../../layout/Select'
import TagsInput from '../../layout/TagsInput'
import Tag from '../../layout/Tag'
import TextHighlight from '../../layout/TextHighlight'
import DateInput from '../../layout/DateInput'

// components used only for base theme
import Checkbox from './Checkbox'
import Icon from './Icon'
import MissingTypeComponent from './MissingTypeComponent'
import TableHeaderCell from './TableHeaderCell'

import { defaultTheme } from '../../utils/theme'

let theme = {
  BarChart,
  Box: 'div',
  Button: 'button',
  Checkbox,
  CheckButton,
  DateInput,
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
