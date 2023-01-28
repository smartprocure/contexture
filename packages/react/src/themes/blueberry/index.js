import { defaultProps } from 'react-recompose'
import React from 'react'

import Button from './Button.js'
import ButtonRadio from './ButtonRadio.js'
import Checkbox from './Checkbox.js'
import Fonts from './Fonts.js'
import DropdownItem from './DropdownItem.js'
import { PagerItem } from './PagerItem.js'
import Style from './Style.js'
import Tag from './Tag.js'
import TextInput from './TextInput.js'

import {
  Box,
  ButtonGroup,
  Table,
  TextButton,
  NestedPicker,
  TagsInput,
} from '../../greyVest/index.js'

export default {
  AlternateButton: TextButton,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Fonts,
  Root: ({ children }) => (
    <>
      <Style />
      <Fonts />
      {children}
    </>
  ),
  DropdownItem,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  PagerItem,
  NestedPicker: defaultProps({ PickerItem: DropdownItem })(NestedPicker),
  RadioList: ButtonRadio,
  Style,
  Table,
  TagsInput: defaultProps({ Tag })(TagsInput),
  TextInput,
}
