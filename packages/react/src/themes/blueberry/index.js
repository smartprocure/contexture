import { defaultProps } from 'recompose'
import React from 'react'

import Button from './Button'
import ButtonRadio from './ButtonRadio'
import Checkbox from './Checkbox'
import Fonts from './Fonts'
import ListItem from './ListItem'
import PagerItem from './PagerItem'
import Style from './Style'
import Tag from './Tag'
import TextInput from './TextInput'

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
  ListItem,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  PagerItem,
  PickerItem: ListItem,
  RadioList: ButtonRadio,
  Style,
  Table: props => <table className="bb-table" {...props} />,
  Tag,
  TextInput,
}
