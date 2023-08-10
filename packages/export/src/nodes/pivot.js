import _ from 'lodash/fp.js'
import F from 'futil'
import ContextureClient from 'contexture-client'
import {
  getKey,
  resultsForDrilldown,
} from 'contexture-client/exampleTypes/pivot.js'
import { andGroup, runWith, setFilterOnly } from '../utils.js'

// TODO move to shared folder
let getPageSize = (grouping) => {
  let pageSizeGetters = {
    fieldValues: _.getOr(10, 'size'),
  }
  return _.getOr(_.noop, grouping.type, pageSizeGetters)(grouping)
}

export let getGroupingSize = (node, groupingType, cardinalityResult, exportAllPages) => {
  let getNested = _.get(groupingType)
  let groupingCardinality = 1 // starting with 1 for the total column/row

  F.walk(getNested)((groupResult, index, parents) => {
    let groupCardinality = _.getOr(
      _.size(getNested(groupResult)),
      `${groupingType}GroupCount`,
      groupResult
    )
    if (!groupCardinality) return

    let grouping = _.get([groupingType, _.size(parents)], node)

    if (!exportAllPages)
      groupCardinality = _.min([groupCardinality, getPageSize(grouping)])

    // TODO else approximate full cardinality by using the average size of the first page of each grouping

    groupingCardinality = groupingCardinality + groupCardinality
  })(cardinalityResult)

  return groupingCardinality
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
    let groups = _.cloneDeep(_.get(type, node))
    let lastGroup = _.last(groups)
    if (_.isEmpty(groups)) return {}

    if (lastGroup.type === 'fieldValues')
      F.mergeOn(lastGroup, { groupCounts: true, skip: true })

    if (exportAllPages) _.each(_.setOn('groupCounts', true), groups)

    let cardinalityNode = await run({
      ...node,
      columns: [],
      rows: [],
      [type]: groups, // getting only groups for this type
      values: _.map(_.set('skip', true), node.values),
      expanded: {
        [type]: true,
      },
    })

    return _.get('context.results', cardinalityNode)
  }

  // Querying sequentially to reduce the load on ES
  let columnGroupingResult = await getGroupingResult('columns')
  let rowGroupingResult = await getGroupingResult('rows')

  let columnGroupingSize = getGroupingSize(
    node,
    'columns',
    columnGroupingResult,
    exportAllPages
  )
  let rowGroupingSize = getGroupingSize(node, 'rows', rowGroupingResult, exportAllPages)
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
            recordCount: getGroupingSize(node, 'columns', row, exportAllPages) * valuesSize,
            rows: undefined, // removing children rows to avoid memory leaks
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
        recordCount: getGroupingSize(node, 'columns', totalRow, exportAllPages) * valuesSize,
        rows: undefined, // removing children rows to avoid memory leaks
      }
    },
  }
  return pivot
}
