import _ from 'lodash/fp.js'
import { pickSafeNumbers } from '../../utils/futil.js'

const getMinAndMax = (range) => {
  const min = range[0]
  const max = range[range.length - 1]
  return { min, max }
}

const isValueMaxOnSteps = (value, steps) => {
  const max = steps[steps.length - 1]
  return value === max
}

let filter = ({ field, range, steps }) => {
  const { min, max } = getMinAndMax(range)

  /** In the last step, we do not filter by the upper bound */
  if (isValueMaxOnSteps(max, steps)) {
    return {
      range: { [field]: pickSafeNumbers({ gte: min }) },
    }
  }

  return {
    range: { [field]: pickSafeNumbers({ gte: min, lte: max }) },
  }
}

let buildQuery = (field, range, steps) => {
  return {
    aggs: {
      rangeFilter: {
        filter: filter({ field, range, steps }),
      },
    },
  }
}

let result = async (node, search) => {
  let { field, range, steps } = node
  const result = await search(buildQuery(field, range, steps))
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
