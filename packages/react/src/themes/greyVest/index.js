import { defaultProps } from 'recompose'
import React from 'react'

// components exported from component library
import {
  Box,
  Button,
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
  Tag,
  TextHighlight,
  TextInput,
} from '../../greyVest'

//components used only for theme
import UnmappedNodeComponent from './UnmappedNodeComponent'
import PickerItem from './PickerItem'

export default {
  Box,
  Button,
  Checkbox,
  DateInput,
  Globals: ({ children }) => (
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
  UnmappedNodeComponent,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  Tag,
  TextHighlight,
}
