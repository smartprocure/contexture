import { runWith } from '../utils.js'

export async function getTotal(runSearch, { groupField: statsField }) {
  const node = {
    type: 'stats',
    statsField,
    stats: { cardinality: true },
  }
  return (await runSearch(node)).context?.cardinality ?? 0
}

export async function getResults(
  runSearch,
  { groupField, statsField, includeFields }
) {
  const node = {
    type: 'fieldValuesGroupStats',
    groupField,
    statsField,
    size: await getTotal(runSearch, { groupField }),
    stats: includeFields
      ? { sum: true, topHits: { size: 1, _source: includeFields } }
      : { sum: true },
  }
  return ((await runSearch(node)).context?.results ?? []).map((result) => ({
    count: result.count,
    [groupField]: result.key,
    sum: result.sum,
    ...(includeFields ? result.topHits.hits[0]?._source ?? {} : {}),
  }))
}

export default (service, tree, props) => {
  const runSearch = (node) => runWith(service, tree, node)
  return {
    getTotalRecords() {
      return getTotal(runSearch, props)
    },
    async *[Symbol.asyncIterator]() {
      yield* await getResults(runSearch, props)
    },
  }
}
