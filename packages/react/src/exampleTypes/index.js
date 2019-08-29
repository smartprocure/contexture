import Facet from './Facet'
import Number from './Number'
import Date from './Date'
import DateRangePicker from './DateRangePicker'
import Query from './Query'
import Geo from './Geo'
import TagsQuery from './TagsQuery'
import TagsText from './TagsText'
import Exists from './Exists'
import Bool from './Bool'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import PagedResultTable from './PagedResultTable'
import CheckableResultTable from './CheckableResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import TermsStats from './TermsStats'
import TermsStatsTable from './TermsStatsTable'
import CheckableTermsStatsTable from './CheckableTermsStatsTable'
import Text from './Text'

export let TypeMap = {
  facet: Facet,
  query: Query,
  number: Number,
  date: Date,
  tagsQuery: TagsQuery,
  tagsText: TagsText,
  geo: Geo,
  text: Text,
  mongoId: Text,
  exists: Exists,
  bool: Bool,
}

export {
  Facet,
  Number,
  Date,
  DateRangePicker,
  Query,
  TagsQuery,
  Exists,
  Bool,
  ResultTable,
  PagedResultTable,
  ResultCount,
  ResultPager,
  DateHistogram,
  TermsStats,
  TermsStatsTable,
  CheckableTermsStatsTable,
  Geo,
  Text,
  TagsText,
  CheckableResultTable,
}
