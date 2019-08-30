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

import { NestedPicker } from '../../greyVest'

export default {
  Button,
  Checkbox,
  Fonts,
  Globals: ({ children }) => (
    <>
      <Style />
      {children}
    </>
  ),
  DropdownItem,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  PagerItem,
  NestedPicker: defaultProps({ PickerItem: DropdownItem })(NestedPicker),
  RadioList: ButtonRadio,
  Style,
  Table: props => <table className="bb-table" {...props} />,
  Tag,
  TextInput,
}
