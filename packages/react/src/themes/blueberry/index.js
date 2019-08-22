import { defaultProps } from 'recompose'

import TextInput from '../../blueberry/TextInput'
import Checkbox from '../../blueberry/Checkbox'
import Fonts from '../../blueberry/Fonts'
import Style from '../../blueberry/Style'
import Table from '../../blueberry/Table'
import Button from '../../blueberry/Button'
import ButtonRadio from '../../blueberry/ButtonRadio'
import ListItem from '../../blueberry/ListItem'
import TextHighlight from '../../blueberry/TextHighlight'
import Tag from '../../blueberry/Tag'
import PagerItem from '../../blueberry/PagerItem'

export default {
  Button,
  Checkbox,
  Fonts,
  TextHighlight,
  TextInput,
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  ListItem,
  PagerItem,
  PickerItem: ListItem,
  RadioList: ButtonRadio,
  Style,
  Table,
  Tag,
}
