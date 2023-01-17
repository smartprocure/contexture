import { groupStats } from './groupStatUtils.js'
import tagsQuery from '../filters/tagsQuery.js'

export default {
  ...groupStats(tagsQuery.buildResultQuery),
  drilldown: tagsQuery.filter,
}
