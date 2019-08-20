import React from 'react'

import ExampleTypeConstructor from '../../exampleTypes/'

import TextInput from './TextInput'
import Checkbox from './Checkbox'
import Fonts from './Fonts'
import Style from './Style'
import Table from './Table'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import ListItem from './ListItem'
import TextHighlight from './TextHighlight'
import Tag from './Tag'
import PagerItem from './PagerItem'

export let Pager = props => (
  <ExampleTypes.ResultPager Item={PagerItem} {...props} />
)

let baseTheme = {
  Button,
  Checkbox,
  Fonts,
  TextHighlight,
  TextInput,
  ListItem,
  Pager,
  PickerItem: ListItem,
  RadioList: ButtonRadio,
  Style,
  Table,
  Tag,
}

let { TypeMap, ...ExampleTypes } = ExampleTypeConstructor(baseTheme)

export {
  Button,
  ButtonRadio,
  Checkbox,
  ExampleTypes,
  Fonts,
  TextHighlight,
  TextInput,
  ListItem,
  PagerItem,
  Style,
  Table,
  Tag,
  TypeMap,
}

export default {
  ...baseTheme,
  ...ExampleTypes,
}
