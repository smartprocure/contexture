import _ from 'lodash/fp.js'
import F from 'futil'
import ContextureClient from 'contexture-client';
import { andGroup, runWith, setFilterOnly } from '../utils.js'
import * as path from 'path'


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
    ContextureClient({
      service,
      debounce: 0,
    }, andGroup(setFilterOnly(tree), node))

  let cardinalityNode = await run({
    ...node,
    expanded: {
      columns: true,
      rows: true,
      skipNested: true,
      skipValues: true,
      cardinality: true,
    },
  })

  let cardinalityResult =
    _.get(
      'context.results',
      cardinalityNode
    )

  let getGroupingCardinality = (groupingType, result) => {
    let getNested = _.get(groupingType)
    let groupingCardinality = 1 // default to 1 for grand total column/row

    F.walk(getNested)(
      (groupResult, index, parents) => {
        let groupCardinality = _.getOr(_.size(getNested(groupResult)),`${groupingType}Cardinality` , groupResult)
        if (!groupCardinality) return

        let grouping = _.get([groupingType, _.size(parents)], node)
        if (!exportAllPages && grouping.type === 'fieldValues') {
          groupCardinality = _.min([groupCardinality, _.getOr(10, 'size', grouping)])
        }
        // TODO else approximate full cardinality by using the size of the first page of each grouping

        groupingCardinality = groupingCardinality + groupCardinality
      }
    )(result)

    return groupingCardinality
  }

  let columnCardinality = getGroupingCardinality('columns', cardinalityResult)
  let rowCardinality = getGroupingCardinality('rows', cardinalityResult)

  let pivotCardinality = columnCardinality * rowCardinality * (_.size(node.values) || 1)

  let pivot = {
    node: cardinalityNode,
    getTotalRecords() {
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

      let yieldRows = (drilldown) =>
         async function * () {
          let result = resultsForDrilldown('rows', drilldown, _.get('context.results', cNode))
          let index = 0
          let level = _.size(drilldown)

          for (let row of result.rows) {
            let path = [...drilldown, getKey(row)]
            yield {
              ...row,
              path,
              index: index++,
              level,
              recordCount: getGroupingCardinality('columns', row) * (_.size(cNode.values) || 1),
            };

            // if this row can have nested rows
            if (_.size(drilldown) < _.size(cNode.rows) - 1) {
              cNode.expand('rows', path)
              await search.triggerUpdate()

              yield * yieldRows(path)()

              cNode.collapse('rows', path)
            }
          }

          // TODO pagination if exportAllPages
        }

      yield * yieldRows([])()

      let totalRow = _.get('context.results', cNode)

      yield {...totalRow, path: [], index: 0, level: -1, isTotalRow: true}
    },
  }
  return pivot
}
