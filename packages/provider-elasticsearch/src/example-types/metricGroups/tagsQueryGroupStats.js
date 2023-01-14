import { groupStats } from './groupStatUtils.js'
import { buildResultQuery, filter } from '../filters/tagsQuery.js'

let { buildQuery, buildGroupQuery, validContext, result } =
  groupStats(buildResultQuery)

export { buildQuery, buildGroupQuery, validContext, result }

export let drilldown = filter
