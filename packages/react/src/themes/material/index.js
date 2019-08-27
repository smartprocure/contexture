import { KeyboardDatePicker } from '@material-ui/pickers'
import { defaultProps } from 'recompose'
import { lensify } from './utils'
import {
  Box,
  Button,
  Checkbox,
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
import Tag from './Tag'

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
  NumberInput: defaultProps({ type: 'number', fullWidth: true })(Input),
  Popover,
  RadioList,
  Select,
  Style,
  Table,
  TableCell,
  TableRow,
  Tag,
  TagsInput,
  TextInput: defaultProps({ fullWidth: true })(Input),
}
