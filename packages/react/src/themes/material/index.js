import React from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { defaultProps } from 'recompose'
import { lensify } from './utils'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Input,
  ListItem,
  Dialog,
  Table,
  TableCell,
  TableRow,
} from '@material-ui/core'

import RadioList from './RadioList'
import TagsInput from './TagsInput'
import Fonts from './Fonts'
import Icon from './Icon'
import Popover from './Popover'
import Style from './Style'
import Select from './Select'

let Tag = ({ removeTag, value, ...props }) => (
  <Chip onDelete={() => removeTag(value)} label={value} {...props} />
)

let FullWidthInput = defaultProps({ fullWidth: true })(Input)

export default {
  Box,
  Button: defaultProps({ variant: 'contained' })(Button),
  Checkbox,
  DateInput: defaultProps({ variant: 'inline', disableToolbar: true })(
    KeyboardDatePicker
  ),
  Icon,
  Fonts,
  ListItem,
  PickerItem: ListItem,
  Modal: lensify(Dialog),
  NumberInput: defaultProps({ type: 'number' })(FullWidthInput),
  Popover,
  RadioList,
  Select,
  Style,
  Table,
  TableCell,
  TableRow,
  Tag,
  TagsInput,
  TextInput: FullWidthInput,
}
