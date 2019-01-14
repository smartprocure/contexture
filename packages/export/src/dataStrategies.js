import _ from 'lodash/fp'
import { setFilterOnly } from './utils'

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
}) => {
  let formatTree = ({ pageSize, page, scrollId }) => ({
    ..._.pick(['schema', 'join'], tree),
    type: 'group',
    key: 'limitedSearchRoot',
    children: [
      setFilterOnly(tree),
      {
        key: 'results',
        type: 'results',
        pageSize,
        page,
        include,
        sortField,
        sortDir,
        scroll: true,
        scrollId,
        highlight,
      },
    ],
  })

  let scrollId = null
  let getNext = async () => {
    let result = getTreeResults(
      await service(formatTree({ page, pageSize, scrollId }))
    )
    scrollId = result.context.scrollId
    page++
    return _.map('_source', result.context.response.results)
  }

  const getTotalRecords = async () => {
    let data = await service(formatTree({ pageSize: 1, page: 1 }))
    let totalRecords = getTreeResults(data).context.response.totalRecords
    let expectedRecords = totalPages * pageSize
    return totalRecords < expectedRecords ? totalRecords : expectedRecords
  }

  return {
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
}) => {
  let formatTree = analysisNode => ({
    ..._.pick(['schema', 'join'], tree),
    type: 'group',
    key: 'limitedSearchRoot',
    children: [setFilterOnly(tree), analysisNode],
  })

  let getTotalRecords = _.memoize(async () => {
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
  })

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
