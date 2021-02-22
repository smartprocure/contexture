import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema'
import HighlightedColumn from './HighlightedColumn'
import { addBlankRows, blankResult } from '../../utils/format'
import { withTheme } from '../../utils/theme'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = ({
  node,
  visibleFields,
  fields,
  hiddenFields,
  schema,
  getRowKey = _.get('_id'),
  blankRows,
  pageSize,
  stickyColumn,
  theme: { Tbody, Tr, Td },
  Row = Tr,
}) => {
  let results = blankRows
    ? addBlankRows(getResults(node), pageSize, '_id')
    : getResults(node)
  return (
    <Tbody>
      {!!results.length &&
        _.map(
          x => (
            <Row
              key={getRowKey(x)}
              record={getRecord(x)}
              {...{ fields, visibleFields, hiddenFields }}
            >
              {_.map(
                ({ field, display = x => x, Cell = Td }) => (
                  <Cell
                    key={field}
                    className={field === stickyColumn ? 'sticky-column' : ''}
                    style={{
                      position: field === stickyColumn ? 'sticky' : '',
                      left: 0,
                    }}
                  >
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
    </Tbody>
  )
}

export default _.flow(observer, withTheme)(TableBody)
