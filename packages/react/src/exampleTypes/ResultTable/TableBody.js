import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema'
import HighlightedColumn from './HighlightedColumn'

let blankText = _.flow(
  _.toString,
  _.map((x) =>
    x === ' ' ? x : '\u2588',
  ),
  _.join(''),
)

let blankResult = (display, data, record) => {
  let formatted = display(data, record)
  if (typeof formatted === 'object') {
    if (_.isArray(_.get('props.children', formatted)))
      return null
    else
      return display(blankText(data), record)
  } else {
    return blankText(formatted)
  }
}

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
  if (limitedResults) {
    let blankResults =
      [...Array(pageSize - results.length)]
        .map((_, i)=>
          ({
            ... results[i % results.length],
            _id: Math.random(),
            isBlank: true,
          })
        )
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
                {x.isBlank ? (
                  <span style={{opacity: .2, fontFamily: 'monospace'}}>
                    {blankResult(display, _.get(field, getRecord(x)), getRecord(x))}
                  </span>
                ) : (
                  display(_.get(field, getRecord(x)), getRecord(x))
                )}
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
