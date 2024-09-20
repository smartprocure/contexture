import _ from 'lodash/fp.js'
import { pickSafeNumbers } from '../../utils/futil.js'

let filter = ({ field, min, max }) => ({
  range: { [field]: pickSafeNumbers({ gte: min, lte: max }) },
})

let buildQuery = (field, min, max) => {
  return {
    aggs: {
      rangeFilter: {
        filter: filter({ field, min, max }),
      },
    },
  }
}

let result = async (node, search) => {
  let { field, min, max } = node
  const result = await search(buildQuery(field, min, max))
  const recordsCount = result.aggregations.rangeFilter.doc_count
  return { recordsCount }
}

export default {
  hasValue: ({ min }) => !_.isNil(min),
  filter,
  validContext: ({ min }) => !_.isNil(min),
  result,
  buildQuery,
}
