import React from 'react'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
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
  AlternateButton: Button,
  Checkbox,
  DateInput: defaultProps({ variant: 'inline', disableToolbar: true })(
    KeyboardDatePicker
  ),
  Icon,
  ListItem,
  PickerItem: ListItem,
  Modal: openify(Dialog),
  NumberInput: defaultProps({ type: 'number', fullWidth: true })(Input),
  Popover,
  RadioList,
  Root: ({ children }) => (
    <>
      <Fonts />
      <Style />
      {/* all this just for a silly date picker */}
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {children}
      </MuiPickersUtilsProvider>
    </>
  ),
  Select,
  Table,
  TableCell,
  TableRow,
  Tag,
  TagsInput,
  TextInput: defaultProps({ fullWidth: true })(Input),
}
