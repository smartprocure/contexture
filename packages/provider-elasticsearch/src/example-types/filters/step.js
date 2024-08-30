import _ from 'lodash/fp.js'
import { pickSafeNumbers } from '../../utils/futil.js'

const getMinAndMax = (range) => {
  const min = range[0]
  const max = range[range.length - 1]
  return { min, max }
}

let filter = ({ field, range }) => {
  const { min, max } = getMinAndMax(range)
  return {
    range: { [field]: pickSafeNumbers({ gte: min, lte: max }) },
  }
}

let buildQuery = (field, range) => {
  return {
    aggs: {
      rangeFilter: {
        filter: filter({ field, range }),
      },
    },
  }
}

let result = async (node, search) => {
  let { field, range } = node
  const result = await search(buildQuery(field, range))
  const recordsCount = result.aggregations.rangeFilter.doc_count
  return { recordsCount }
}

export default {
  hasValue: ({ range }) => !_.isEmpty(range),
  filter,
  validContext: ({ range }) => !_.isEmpty(range),
  result,
  buildQuery,
}
