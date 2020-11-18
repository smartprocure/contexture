import F from 'futil'
import _ from 'lodash/fp'
import { setFilterOnly } from './utils'
import { flattenProp } from './futil'

let getTreeResults = _.flow(
  _.get('children'),
  _.last
)

// results strategy,
// it will wrap the given search tree with a simple layer that uses all of the given search tree
// as filters and finally outputs the results on a new node.
// It will progress through the result by looping over the given pages.
export const results = ({
  service,
  tree,
  pageSize = 100,
  page = 1,
  totalPages = 100,
  include,
  sortField,
  sortDir,
  highlight,
  scroll,
  ...rest
}) => {
  let formatTree = ({ pageSize, page, scrollId, skipCount = false }) => {
    let resultsConfig = {
      key: 'results',
      type: 'results',
      pageSize,
      page,
      include,
      sortField,
      sortDir,
      highlight,
      skipCount,
      ...rest,
    }

    if (scroll) {
      resultsConfig.scroll = true
      resultsConfig.scrollId = scrollId
    }

    return {
      ..._.pick(['schema', 'join'], tree),
      type: 'group',
      key: 'limitedSearchRoot',
      children: [setFilterOnly(tree), resultsConfig],
    }
  }

  let scrollId = null
  let getNext = async () => {
    let result = getTreeResults(
      await service(formatTree({ page, pageSize, scrollId, skipCount: true }))
    )
    scrollId = result.context.scrollId
    page++
    // We return _source flattened onto the root result items because we're mostly
    // interested in the _source properties but may occasionally want other props like _id.
    // This will be removed with #28 when a contexture-elasticsearch upgrade is complete
    return _.map(
      flattenProp('_source'),
      F.cascade(['response.results', 'results'], result.context)
    )
  }

  const getTotalRecords = async () => {
    let data = await service(formatTree({ pageSize: 1, page: 1 }))
    let totalRecords = F.cascade(
      ['response.totalRecords', 'totalRecords'],
      getTreeResults(data).context
    )
    let expectedRecords = totalPages * pageSize
    return totalRecords < expectedRecords ? totalRecords : expectedRecords
  }

  return {
    include,
    formatTree,
    getTotalRecords,
    hasNext: () => page <= totalPages,
    getNext,
  }
}

// terms_Stats strategy,
// it will wrap the given search tree with a simple layer that uses all of the given search tree
// as filters and finally outputs the term statistics on a new node.
// Data will be obtained in one shot.
export const terms_stats = ({
  service,
  tree,
  key_field,
  value_field,
  size = 100,
  sortDir,
  include,
}) => {
  let formatTree = analysisNode => ({
    ..._.pick(['schema', 'join'], tree),
    type: 'group',
    key: 'limitedSearchRoot',
    children: [setFilterOnly(tree), analysisNode],
  })

  let getTotalRecords = async () => {
    let result = getTreeResults(
      await service(
        formatTree({
          key: 'cardinality',
          type: 'cardinality',
          field: key_field,
          fieldMode: 'autocomplete',
        })
      )
    )
    return _.get('context.value', result)
  }

  let done = false
  let getNext = async () => {
    let result = getTreeResults(
      await service(
        formatTree({
          key: 'stats',
          type: 'terms_stats',
          key_field,
          value_field,
          size: size || (await getTotalRecords()),
          sortDir,
          include,
        })
      )
    )
    done = true
    return result.context.terms
  }

  return {
    formatTree,
    getTotalRecords,
    hasNext: () => !done,
    getNext,
  }
}
