import React from 'react'

import { theme as defaultTheme } from '../../layout'
import ExampleTypeConstructor from '../../exampleTypes/'

import Input from './Input'
import Checkbox from './Checkbox'
import Fonts from './Fonts'
import Style from './Style'
import Table from './Table'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import ListGroupItem from './ListGroupItem'
import Wrap from './Wrap'
import TagComponent from './TagComponent'
import PagerItem from './PagerItem'
import Adder from './Adder'

export let Pager = props => <ExampleTypes.ResultPager Item={PagerItem} {...props} />

let baseTheme = {
  ...defaultTheme,
  Adder,
  'Adder.Item': ListGroupItem,
  Wrap,
  Fonts,
  Style,
  Table,
  Button,
  Input,
  Checkbox,
  RadioList: ButtonRadio,
  'FieldPicker.Item': ListGroupItem,
  'TagsInput.TagComponent': TagComponent,
  Pager,
}

let { TypeMap, ...ExampleTypes } = ExampleTypeConstructor(baseTheme)

export {
  TypeMap,
  ExampleTypes,
  Input,
  Checkbox,
  Fonts,
  Style,
  Table,
  Button,
  ButtonRadio,
  ListGroupItem,
  Wrap,
  TagComponent, 
  PagerItem,
  Adder,
}

export let theme = {
  ...baseTheme,
  ...ExampleTypes
}
