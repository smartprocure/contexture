import ExampleTypes from '../src/exampleTypes/'
import { partial } from '../src/utils/mobx-react-utils'
import ModalFilterAdder from '../src/ModalFilterAdder'
import {
  Button,
  Input,
  Highlight,
  ListGroupItem as Item,
  PagerItem,
} from './DemoControls'

export let Adder = ModalFilterAdder({ Button, Input, Highlight, Item })

let { ResultPager } = ExampleTypes({ })
export let Pager = partial({ Item: PagerItem }, ResultPager)
