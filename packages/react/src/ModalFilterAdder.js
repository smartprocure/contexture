import FilterAdder from '../src/FilterAdder'
import { partial } from '../src/utils/mobx-react-utils'
import { Modal, ModalPicker, FilteredPicker } from '../src/layout/'

export default ({
  Item,
  Input,
  Button,
  Highlight,
  label = 'Add Custom Filter',
} = {}) => partial(
  {
    Picker: partial(
      {
        Modal,
        Button,
        label,
        Picker: partial({ Input, Highlight, Item }, FilteredPicker),
      },
      ModalPicker
    ),
  },
  FilterAdder
)