import { groupStats } from './groupStatUtils.js'
import tagsQuery from '../filters/tagsQuery.js'

let { buildResultQuery, filter } = tagsQuery

export default {
  ...groupStats(buildResultQuery),
  drilldown: filter,
}
