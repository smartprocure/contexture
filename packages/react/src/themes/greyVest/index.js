import { defaultProps } from 'react-recompose'

// components exported from component library
import {
  BarChart,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Icon,
  DropdownItem,
  NestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextButton,
  TextHighlight,
  TextInput,
  Popover,
} from '../../greyVest/index.js'

//components used only for theme
import PickerItem from './PickerItem.js'
import TagsInput, { Tag } from './TagsInput.js'
import Root from './Root.js'
import UnmappedNodeComponent from './UnmappedNodeComponent.js'

export default {
  AlternateButton: TextButton,
  BarChart,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Root,
  Icon,
  TextInput,
  DropdownItem,
  NestedPicker: defaultProps({ PickerItem })(NestedPicker),
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  TagsInput,
  Tag,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextHighlight,
  Popover,
  Tbody: 'tbody',
  Td: 'td',
  TextButton: 'button',
  Tfoot: 'tfoot',
  Th: 'th',
  Thead: 'thead',
  Tr: 'tr',
  UnmappedNodeComponent,
}
