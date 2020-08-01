import Facet from './Facet'
import DateRangeFacet from './DateRangeFacet'
import Number from './Number'
import Date from './Date'
import Query from './Query'
import Geo from './Geo'
import TagsQuery from './TagsQuery'
import TagsText from './TagsText'
import Exists from './Exists'
import Bool from './Bool'
import Text from './Text'

export default {
  facet: Facet,
  dateRangeFacet: DateRangeFacet,
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
