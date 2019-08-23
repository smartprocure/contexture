import { defaultProps } from 'recompose'

// components exported from GreyVest component library
import Box from '../../greyVest/Box'
import Button from '../../greyVest/Button'
import Checkbox from '../../greyVest/Checkbox'
import Fonts from '../../greyVest/Fonts'
import Icon from '../../greyVest/Icon'
import ListItem from '../../greyVest/ListItem'
import Modal from '../../greyVest/Modal'
import PagerItem from '../../greyVest/PagerItem'
import RadioList from '../../greyVest/RadioList'
import Select from '../../greyVest/Select'
import Style from '../../greyVest/Style'
import Table from '../../greyVest/Table'
import TextHighlight from '../../greyVest/TextHighlight'
import TextInput from '../../greyVest/TextInput'

//components used only for GreyVest theme
import DateInput from './DateInput'
import FilterListItem from './FilterListItem'
import MissingTypeComponent from './MissingTypeComponent'
import ModalPicker from './ModalPicker'
import Tag from './Tag'

export default {
  'FilterAdder.ModalPicker': ModalPicker,
  Box,
  Button,
  Checkbox,
  DateInput,
  Fonts,
  Icon,
  TextInput,
  ListItem,
  PickerItem: FilterListItem,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  MissingTypeComponent,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Style,
  Table,
  Tag,
  TextHighlight,
}
