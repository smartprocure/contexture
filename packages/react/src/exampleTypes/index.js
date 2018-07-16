import Facet from './Facet'
import Number from './Number'
import Date from './Date'
import DateRangePicker from './DateRangePicker'
import Query from './Query'
import TagsQuery from './TagsQuery'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import TermsStats from './TermsStats'
import Text from './Text'
import { partial } from '../utils/mobx-react-utils'
import ModalDefault from '../layout/Modal'

export default (
  {
    Input = 'input',
    TextInput = Input,
    NumberInput = partial({ type: 'number' }, Input),
    DateInput = partial({ type: 'date' }, Input),
    Checkbox = partial({ type: 'checkbox' }, 'input'),
    RadioList,
    TagsInput,
    Table = 'table',
    Modal = ModalDefault,
    FieldPicker,
    ListGroupItem = 'div'
  } = {}
) => {
  let Components = {
    Facet: partial({ TextInput, Checkbox, RadioList }, Facet),
    Number: partial({ NumberInput }, Number),
    Date: partial({ DateInput }, Date),
    DateRangePicker,
    Query: partial({ TextInput }, Query),
    TagsQuery: partial({ TagsInput }, TagsQuery),
    ResultTable: partial({ Table, Modal, FieldPicker, ListGroupItem }, ResultTable),
    ResultCount,
    ResultPager,
    DateHistogram,
    TermsStats,
    Text: partial({ Input }, Text),
  }
  let TypeMap = {
    facet: Components.Facet,
    query: Components.Query,
    number: Components.Number,
    date: Components.Date,
    tagsQuery: Components.TagsQuery,
    text: Components.Text,
  }
  return { ...Components, TypeMap }
}
