import Facet from './Facet.js'
import DateRangeFacet from './DateRangeFacet.js'
import Number from './Number.js'
import Date from './Date.js'
import Query from './Query.js'
import Geo from './Geo.js'
import TagsQuery from './TagsQuery/index.js'
import TagsText from './TagsText.js'
import Exists from './Exists.js'
import Bool from './Bool.js'
import Text from './Text.js'
import StepSlider from './StepSlider'

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
  step: StepSlider,
}
