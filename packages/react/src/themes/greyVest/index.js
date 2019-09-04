import { defaultProps } from 'recompose'
import React from 'react'

// components exported from component library
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Fonts,
  Icon,
  DropdownItem,
  NestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Style,
  Table,
  TextButton,
  TextHighlight,
  TextInput,
} from '../../greyVest'

//components used only for theme
import PickerItem from './PickerItem'
import TagsInput from './TagsInput'

export default {
  AlternateButton: TextButton,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Root: ({ children }) => (
    <>
      <Fonts />
      <Style />
      {children}
    </>
  ),
  Icon,
  TextInput,
  DropdownItem,
  NestedPicker: defaultProps({ PickerItem })(NestedPicker),
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  TagsInput,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextHighlight,
}
