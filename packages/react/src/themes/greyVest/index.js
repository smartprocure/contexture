import { defaultProps } from 'recompose'
import React from 'react'

// components exported from component library
import Box from '../../greyVest/Box'
import Button from '../../greyVest/Button'
import Checkbox from '../../greyVest/Checkbox'
import DateInput from '../../greyVest/DateInput'
import Fonts from '../../greyVest/Fonts'
import Icon from '../../greyVest/Icon'
import ListItem from '../../greyVest/ListItem'
import Modal from '../../greyVest/Modal'
import PagerItem from '../../greyVest/PagerItem'
import RadioList from '../../greyVest/RadioList'
import Select from '../../greyVest/Select'
import Style from '../../greyVest/Style'
import Table from '../../greyVest/Table'
import Tag from '../../greyVest/Tag'
import TextHighlight from '../../greyVest/TextHighlight'
import TextInput from '../../greyVest/TextInput'

//components used only for theme
import FilterAdderModalPicker from './FilterAdderModalPicker'
import MissingTypeComponent from './MissingTypeComponent'
import PickerItem from './PickerItem'

export default {
  'FilterAdder.ModalPicker': FilterAdderModalPicker,
  Box,
  Button,
  Checkbox,
  DateInput,
  Globals: ({ children }) => (
    <>
      <Fonts />
      <Style />
      {children}
    </>
  ),
  Icon,
  TextInput,
  ListItem,
  PickerItem,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  MissingTypeComponent,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  Tag,
  TextHighlight,
}
