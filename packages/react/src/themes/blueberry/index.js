import React from 'react'

import ExampleTypeConstructor from '../../exampleTypes/'

import Input from './Input'
import Checkbox from './Checkbox'
import Fonts from './Fonts'
import Style from './Style'
import Table from './Table'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import ListGroupItem from './ListGroupItem'
import HighlightWrap from './HighlightWrap'
import TagComponent from './TagComponent'
import PagerItem from './PagerItem'
import Adder from './Adder'

export let Pager = props => (
  <ExampleTypes.ResultPager Item={PagerItem} {...props} />
)

let baseTheme = {
  Adder,
  Button,
  Checkbox,
  Fonts,
  HighlightWrap,
  Input,
  Item: ListGroupItem,
  Pager,
  RadioList: ButtonRadio,
  Style,
  Table,
  TagComponent,
}

let { TypeMap, ...ExampleTypes } = ExampleTypeConstructor(baseTheme)

export {
  Adder,
  Button,
  ButtonRadio,
  Checkbox,
  ExampleTypes,
  Fonts,
  HighlightWrap,
  Input,
  ListGroupItem,
  PagerItem,
  Style,
  Table,
  TagComponent,
  TypeMap,
}

export default {
  ...baseTheme,
  ...ExampleTypes,
}
