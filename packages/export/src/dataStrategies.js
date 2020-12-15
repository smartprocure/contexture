import F from 'futil'
import _ from 'lodash/fp'
import { runWith } from './utils'
import { flattenProp } from './futil'

// Will go away once results no longer wraps context in `response`
let resultField = (field, node) =>
  F.cascade([`response.${field}`, field], node.context)

// results strategy,
// it will wrap the given search tree with a simple layer that uses all of the given search tree
// as filters and finally outputs the results on a new node.
// It will progress through the result by looping over the given pages.
export let results = ({ service, tree, totalPages = 100, ...node }) => {
  let { page = 1, pageSize = 100 } = node
  let run = props =>
    runWith(
      service,
      tree,
      F.compactObject({ key: 'results', type: 'results', ...node, ...props })
    )

  let scrollId = null
  let getNext = async () => {
    let result = await run({ page, scrollId, skipCount: true })
    scrollId = result.context.scrollId
    page++
    // We return _source flattened onto the root result items because we're mostly
    // interested in the _source properties but may occasionally want other props like _id.
    // This will be removed with #28 when a contexture-elasticsearch upgrade is complete
    return _.map(
      flattenProp('_source'),
      resultField('results', result)
    )
  }

  const getTotalRecords = async () => {
    let data = await run({ pageSize: 1, page: 1 })
    let totalRecords = resultField('totalRecords', data)
    let expectedRecords = totalPages * pageSize
    return totalRecords < expectedRecords ? totalRecords : expectedRecords
  }

  return {
    getTotalRecords,
    hasNext: () => page <= totalPages,
    getNext,
  }
}

// terms_Stats strategy,
// it will wrap the given search tree with a simple layer that uses all of the given search tree
// as filters and finally outputs the term statistics on a new node.
// Data will be obtained in one shot.
export let terms_stats = ({ service, tree, ...node }) => {
  let { key_field, size = 100 } = node
  let run = node => runWith(service, tree, node)

  let getTotalRecords = async () => {
    let result = await run({
      key: 'cardinality',
      type: 'cardinality',
      field: key_field,
      fieldMode: 'autocomplete',
    })
    return _.get('context.value', result)
  }

  let done = false
  let getNext = async () => {
    let result = await run({
      key: 'stats',
      type: 'terms_stats',
      key_field,
      size: size || (await getTotalRecords()),
      ...node
    })
    
    done = true
    return result.context.terms
  }

  return {
    getTotalRecords,
    hasNext: () => !done,
    getNext,
  }
}
