import { defaultProps } from 'recompose'

import Box from '../../greyVest/Box'
import Button from '../../greyVest/Button'
import Checkbox from '../../greyVest/Checkbox'
import CheckButton from '../../greyVest/CheckButton'
import DateInput from '../../greyVest/DateInput'
import FilterListItem from '../../greyVest/FilterListItem'
import Fonts from '../../greyVest/Fonts'
import Icon from '../../greyVest/Icon'
import LinkButton from '../../greyVest/LinkButton'
import ListItem from '../../greyVest/ListItem'
import MissingTypeComponent from '../../greyVest/MissingTypeComponent'
import Modal from '../../greyVest/Modal'
import ModalPicker from '../../greyVest/ModalPicker'
import PagerItem from '../../greyVest/PagerItem'
import RadioList from '../../greyVest/RadioList'
import Select from '../../greyVest/Select'
import Style from '../../greyVest/Style'
import Table from '../../greyVest/Table'
import TextHighlight from '../../greyVest/TextHighlight'
import TextInput from '../../greyVest/TextInput'

export default {
  'FilterAdder.ModalPicker': ModalPicker,
  Box,
  Button,
  Checkbox,
  CheckButton,
  DateInput,
  Fonts,
  Link: LinkButton,
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
  TextHighlight,
}
