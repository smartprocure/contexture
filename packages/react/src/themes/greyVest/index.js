import { defaultProps } from 'recompose'
import React from 'react'

// components exported from component library
import {
  Box,
  Button,
  Checkbox,
  DateInput,
  Flex,
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
  TextHighlight,
  TextInput,
} from '../../greyVest'

//components used only for theme
import PickerItem from './PickerItem'
import TagsInput from './TagsInput'

export default {
  Box,
  Button,
  ButtonGroup: defaultProps({ className: 'gv-button-group' })(Flex),
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
