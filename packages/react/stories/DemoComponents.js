import FilterAdder from '../src/FilterAdder'
import ExampleTypes from '../src/exampleTypes/'
import { partial } from '../src/utils/mobx-react-utils'
import { Modal, ModalPicker, FilteredPicker } from '../src/layout/'
import {
  Button,
  Input,
  Highlight,
  ListGroupItem,
  PagerItem,
  PagerList,
} from './DemoControls'

// Pre apply some props
let Adder = partial(
  {
    Picker: partial(
      {
        Modal,
        Button,
        label: 'Add Custom Filter',
        Picker: partial(
          { Input, Highlight, Item: ListGroupItem },
          FilteredPicker
        ),
      },
      ModalPicker
    ),
  },
  FilterAdder
)

let { ResultPager } = ExampleTypes({ Input })
let Pager = partial({ Item: PagerItem, List: PagerList }, ResultPager)

export { Adder, Pager }
