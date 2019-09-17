import { defaultProps } from 'recompose'
import React from 'react'

import Button from './Button'
import ButtonRadio from './ButtonRadio'
import Checkbox from './Checkbox'
import Fonts from './Fonts'
import DropdownItem from './DropdownItem'
import PagerItem from './PagerItem'
import Style from './Style'
import Tag from './Tag'
import TextInput from './TextInput'

import {
  Box,
  ButtonGroup,
  Table,
  TextButton,
  NestedPicker,
  TagsInput,
} from '../../greyVest'

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
