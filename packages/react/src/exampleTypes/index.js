import Facet from './Facet'
import Number from './Number'
import Date from './Date'
import Query from './Query'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import TermsStats from './TermsStats'
import { partial } from '../utils/mobx-react-utils'

export default (
  {
    Input = 'input',
    TextInput = Input,
    NumberInput = partial({ type: 'number' }, Input),
    DateInput = partial({ type: 'date' }, Input),
  } = {}
) => {
  let Components = {
    Facet: partial({ TextInput }, Facet),
    Number: partial({ NumberInput }, Number),
    Date: partial({ DateInput }, Date),
    Query: partial({ TextInput }, Query),
    ResultCount,
    ResultTable,
    ResultPager,
    DateHistogram,
    TermsStats
  }
  let TypeMap = {
    facet: Components.Facet,
    query: Components.Query,
    number: Components.Number,
    date: Components.Date,
  }
  return { ...Components, TypeMap }
}
