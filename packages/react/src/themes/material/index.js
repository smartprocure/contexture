import { KeyboardDatePicker } from '@material-ui/pickers'
import { defaultProps } from 'react-recompose'
import { observer } from 'mobx-react'
import { openBinding } from './utils.js'
import { expandProp } from '../../utils/react.js'
import {
  Button,
  Checkbox,
  Input,
  MenuItem,
  Dialog,
  Table,
} from '@material-ui/core'

import RadioList from './RadioList.js'
import TagsInput from './TagsInput.js'
import Icon from './Icon.js'
import Popover from './Popover.js'
import Select from './Select.js'
import Tag from './Tag.js'
import Root from './Root.js'
import Box from './Box.js'

export default {
  Box,
  Button: defaultProps({ variant: 'contained' })(Button),
  AlternateButton: Button,
  Checkbox,
  DateInput: defaultProps({ variant: 'inline', disableToolbar: true })(
    KeyboardDatePicker
  ),
  Icon,
  DropdownItem: MenuItem,
  PickerItem: MenuItem,
  Modal: observer(expandProp('open', openBinding)(Dialog)),
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
