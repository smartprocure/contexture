import _ from 'lodash/fp.js'
import F from 'futil'
import ContextureClient from 'contexture-client'
import { andGroup, runWith, setFilterOnly } from '../utils.js'

// TODO import from contexture-client
export let getKey = (x) => x.keyAsString || x.key

// TODO import from contexture-client
// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (type, drilldown, results) => {
  if (_.isEmpty(drilldown) || !results) return results

  let key = _.first(drilldown)
  let groups = _.get(type, results)
  let match = _.find((node) => getKey(node) === key, groups)

  return resultsForDrilldown(type, drilldown.slice(1), match)
}

export default async ({ service, tree, exportAllPages, ...node }) => {
  let run = (node) => runWith(service, tree, node)

  let getContextureClient = (tree, node) =>
    ContextureClient(
      {
        service,
        debounce: 0,
      },
      andGroup(setFilterOnly(tree), node)
    )

  let getGroupingResult = async (type) => {
    let groups = _.get(type, node)
    if (_.isEmpty(groups)) return {}
    let hasFieldValuesLast = _.last(groups).type === 'fieldValues'

    let cardinalityNode = await run({
      ...node,
      columns: [],
      rows: [],
      [type]: groups, // getting only groups for this type
      expanded: {
        [type]: true,
        skipValues: true,
        cardinality: hasFieldValuesLast || !!exportAllPages,
      },
    })

    return _.get('context.results', cardinalityNode)
  }

  let getGroupingSize = (groupingType, cardinalityResult) => {
    let getNested = _.get(groupingType)
    let groupingCardinality = 1 // starting with 1 for the total column/row

    F.walk(getNested)((groupResult, index, parents) => {
      let groupCardinality = _.getOr(
        _.size(getNested(groupResult)),
        `${groupingType}Cardinality`,
        groupResult
      )
      if (!groupCardinality) return

      let grouping = _.get([groupingType, _.size(parents)], node)
      if (!exportAllPages && grouping.type === 'fieldValues') {
        groupCardinality = _.min([
          groupCardinality,
          _.getOr(10, 'size', grouping),
        ])
      }
      // TODO else approximate full cardinality by using the size of the first page of each grouping

      groupingCardinality = groupingCardinality + groupCardinality
    })(cardinalityResult)

    return groupingCardinality
  }

  // Querying sequentially to reduce the load on ES
  let columnGroupingResult = await getGroupingResult('columns')
  let rowGroupingResult = await getGroupingResult('rows')

  let columnGroupingSize = getGroupingSize('columns', columnGroupingResult)
  let rowGroupingSize = getGroupingSize('rows', rowGroupingResult)
  let valuesSize = _.size(node.values) || 1

  let pivotSize = columnGroupingSize * rowGroupingSize * valuesSize

  let pivot = {
    node: {
      ...node,
      context: { results: { ...columnGroupingResult, ...rowGroupingResult } },
    },
    getTotalRecords() {
      return pivotSize
    },
    async *[Symbol.asyncIterator]() {
      let search = getContextureClient(tree, {
        ...node,
        expanded: {
          columns: true,
        },
      })
      await search.refresh(['root'])

      let cNode = (pivot.node = search.getNode(['root-parent', node.key]))

      let yieldRows = async function* (drilldown) {
        let result = resultsForDrilldown(
          'rows',
          drilldown,
          _.get('context.results', cNode)
        )
        let index = 0
        let level = _.size(drilldown)

        for (let row of result.rows) {
          let path = [...drilldown, getKey(row)]
          yield {
            ...row,
            path,
            index: index++,
            level,
            recordCount: getGroupingSize('columns', row) * valuesSize,
          }

          // if this row can have nested rows
          if (_.size(drilldown) < _.size(cNode.rows) - 1) {
            await cNode.expand('rows', path)

            yield* yieldRows(path)

            cNode.collapse('rows', path)
          }
        }

        // TODO pagination if exportAllPages
      }

      yield* yieldRows([])

      let totalRow = _.get('context.results', cNode)

      yield {
        ...totalRow,
        isTotalRow: true,
        path: [],
        index: 0,
        level: -1,
        recordCount: getGroupingSize('columns', totalRow) * valuesSize,
      }
    },
  }
  return pivot
}
