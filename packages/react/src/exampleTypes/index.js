import Facet from './Facet'
import Number from './Number'
import Query from './Query'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import Styles from './Styles'

export {Facet, Number, Query, ResultCount, ResultTable, ResultPager, DateHistogram, Styles}

export let TypeMap = {
  facet: Facet,
  query: Query,
  number: Number,
  date: Number, // FIX
}

