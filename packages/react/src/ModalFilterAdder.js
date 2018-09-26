import FilterAdder from './FilterAdder'
import { partial } from './utils/mobx-react-utils'
import { Modal, ModalPicker, FilteredPicker } from './layout/'

export default ({
  Item,
  Input,
  Button,
  Highlight,
  label = 'Add Custom Filter',
} = {}) =>
  partial(
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
