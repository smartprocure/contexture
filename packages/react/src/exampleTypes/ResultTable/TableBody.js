import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema'
import HighlightedColumn from './HighlightedColumn'
import { blankResult } from '../../utils/format'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = ({
  node,
  visibleFields,
  fields,
  hiddenFields,
  schema,
  Row = 'tr',
  getRowKey = _.get('_id'),
  limitedResults,
  pageSize,
}) => {
  let results = getResults(node)
  if (limitedResults && results.length > 0) {
    let blankResults = [...Array(pageSize - results.length)].map((_, i) => ({
      ...results[i % results.length],
      _id: results[i % results.length]._id + i,
      isBlank: true,
    }))
    results = [...results, ...blankResults]
  }
  return (
    <tbody>
      {!!results.length &&
        _.map(
          x => (
            <Row
              key={getRowKey(x)}
              record={getRecord(x)}
              {...{ fields, visibleFields, hiddenFields }}
            >
              {_.map(
                ({ field, display = x => x, Cell = 'td' }) => (
                  <Cell key={field}>
                    {F.when(
                      () => x.isBlank,
                      blankResult,
                      display
                    )(_.get(field, getRecord(x)), getRecord(x))}
                  </Cell>
                ),
                visibleFields
              )}
              {node.showOtherMatches && (
                <HighlightedColumn
                  {...{
                    node,
                    additionalFields: _.result('additionalFields.slice', x),
                    schema,
                  }}
                />
              )}
            </Row>
          ),
          results
        )}
    </tbody>
  )
}

export default observer(TableBody)
