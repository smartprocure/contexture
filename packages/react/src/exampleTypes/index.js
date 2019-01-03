import Facet from './Facet'
import Number from './Number'
import Date from './Date'
import DateRangePicker from './DateRangePicker'
import Query from './Query'
import Geo from './Geo'
import TagsQuery from './TagsQuery'
import TagsText from './TagsText'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import CheckableResultTable from './CheckableResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import TermsStats from './TermsStats'
import TermsStatsTable from './TermsStatsTable'
import CheckableTermsStatsTable from './CheckableTermsStatsTable'
import Text from './Text'
import { defaultProps } from 'recompose'
import ModalDefault from '../layout/Modal'
import DefaultSelect from '../layout/Select'

export default ({
  Input = 'input',
  Button = 'button',
  TextInput = Input,
  NumberInput = defaultProps({ type: 'number' })(Input),
  DateInput = defaultProps({ type: 'date' })(Input),
  Checkbox = defaultProps({ type: 'checkbox' })('input'),
  RadioList,
  TagsInput,
  Table = 'table',
  Modal = ModalDefault,
  FieldPicker,
  ListGroupItem = 'div',
  Icon,
  Select = DefaultSelect
} = {}) => {
  let Components = {
    Facet: defaultProps({ TextInput, Checkbox, RadioList })(Facet),
    Number: defaultProps({ NumberInput, Button })(Number),
    Date: defaultProps({ DateInput })(Date),
    DateRangePicker,
    Query: defaultProps({ TextInput })(Query),
    TagsQuery: defaultProps({ TagsInput, Checkbox, RadioList, Button })(TagsQuery),
    ResultTable: defaultProps({
      Table,
      Modal,
      FieldPicker,
      ListGroupItem,
      Icon,
    })(ResultTable),
    ResultCount,
    ResultPager: defaultProps({ Icon })(ResultPager),
    DateHistogram,
    TermsStats,
    TermsStatsTable,
    CheckableTermsStatsTable,
    Geo,
    Text: defaultProps({ Input })(Text),
    TagsText: defaultProps({ TagsInput, Select })(TagsText)
  }
  Components.CheckableResultTable = defaultProps({
    ResultTable: Components.ResultTable,
    Checkbox,
  })(CheckableResultTable)
  let TypeMap = {
    facet: Components.Facet,
    query: Components.Query,
    number: Components.Number,
    date: Components.Date,
    tagsQuery: Components.TagsQuery,
    tagsText: Components.TagsText,
    geo: Components.Geo,
    text: Components.Text,
  }
  return { ...Components, TypeMap }
}
