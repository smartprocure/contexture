import { KeyboardDatePicker } from '@material-ui/pickers'
import { defaultProps } from 'recompose'
import { openify } from '../../utils/react'
import {
  Box,
  Button,
  Checkbox,
  Input,
  ListItem,
  Dialog,
  Table,
} from '@material-ui/core'

import RadioList from './RadioList'
import TagsInput from './TagsInput'
import Icon from './Icon'
import Popover from './Popover'
import Select from './Select'
import Tag from './Tag'
import Root from './Root'

export default {
  Box,
  Button: defaultProps({ variant: 'contained' })(Button),
  AlternateButton: Button,
  Checkbox,
  DateInput: defaultProps({ variant: 'inline', disableToolbar: true })(
    KeyboardDatePicker
  ),
  Icon,
  DropdownItem: ListItem,
  PickerItem: ListItem,
  Modal: openify(Dialog),
  NumberInput: defaultProps({ type: 'number', fullWidth: true })(Input),
  Popover,
  RadioList,
  Root,
  Select,
  Table: defaultProps({ className: 'material-table' })(Table),
  Tag,
  TagsInput,
  TextInput: defaultProps({ fullWidth: true })(Input),
}
