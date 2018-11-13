import FilterAdder from './FilterAdder'
import { Modal, ModalPicker, NestedPicker } from './layout/'
import { defaultProps } from 'recompose'

export default ({
  Item,
  Input,
  Button,
  Highlight,
  label = 'Add Custom Filter',
  Picker = NestedPicker,
} = {}) =>
  defaultProps({
    Picker: defaultProps({
      Modal,
      Button,
      label,
      Picker: defaultProps({ Input, Highlight, Item })(Picker),
    })(ModalPicker),
  })(FilterAdder)
