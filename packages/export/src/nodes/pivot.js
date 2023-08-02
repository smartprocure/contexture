import _ from 'lodash/fp.js'
import F from 'futil'
import ContextureClient from 'contexture-client'
import { andGroup, runWith, setFilterOnly } from '../utils.js'

// TODO import from contexture-client
let getKey = (x) => x.keyAsString || x.key

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

  let getCardinalityResult = async (type) => {
    let groups = _.get(type, node)
    if (_.isEmpty(groups)) return {}

    let cardinalityNode = await run({
      ...node,
      columns: [],
      rows: [],
      [type]: groups, // getting only groups for this type
      expanded: {
        [type]: true,
        skipValues: true,
        cardinality: true,
      },
    })

    return _.get('context.results', cardinalityNode)
  }

  let getGroupingCardinality = (groupingType, cardinalityResult) => {
    let getNested = _.get(groupingType)
    let groupingCardinality = 1 // default to 1 for grand total column/row

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


  let [columnCardinalityResult, rowCardinalityResult] = await Promise.all(_.map(getCardinalityResult, ['columns', 'rows']))

  let columnCardinality = getGroupingCardinality('columns', columnCardinalityResult)
  let rowCardinality = getGroupingCardinality('rows', rowCardinalityResult)

  let pivotCardinality =
    columnCardinality * rowCardinality * (_.size(node.values) || 1)

  let pivot = {
    node: { ...node, context: { results: { ...columnCardinalityResult, ...rowCardinalityResult } } },
    getTotalRecords () {
      return pivotCardinality
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
              recordCount:
                getGroupingCardinality('columns', row) *
                (_.size(cNode.values) || 1),
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

      yield { ...totalRow, path: [], index: 0, level: -1, isTotalRow: true }
    },
  }
  return pivot
}
