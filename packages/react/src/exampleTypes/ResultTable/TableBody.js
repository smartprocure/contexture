import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema.js'
import HighlightedColumn from './HighlightedColumn.js'
import { addBlankRows, blankResult } from '../../utils/format.js'
import { withTheme } from '../../utils/theme.js'
import { StripedLoader } from '../../greyVest/index.js'

let displayCell = ({ display, value, record, result }) =>
  result.isBlank ? blankResult(display)(value, record) : display(value, record)

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
  theme: { Tbody, Tr, Td, Loader = StripedLoader },
  Row = Tr,
  NoResultsComponent,
  IntroComponent,
  defaultDisplay = displayCell,
}) => {
  let results = blankRows
    ? addBlankRows(getResults(node), pageSize, '_id')
    : getResults(node)

  let hasResults = _.get('length', results)
  let showLoader = node.updating
  let showIntro = !showLoader && !hasResults && !node.lastUpdateTime
  let showNoResults = !showLoader && !showIntro && !hasResults

  return (
    <>
      <Tbody
        style={{
          display: showIntro || showNoResults ? 'none' : '',
        }}
      >
        {_.size(results) &&
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
                        left: field === stickyColumn ? 0 : '',
                      }}
                    >
                      {defaultDisplay({
                        display,
                        value: _.get(field, getRecord(x)),
                        record: getRecord(x),
                        result: x,
                      })}
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
      <Tbody
        style={{
          display: showIntro || showLoader || showNoResults ? '' : 'none',
        }}
      >
        <Tr>
          <Td colSpan={visibleFields.length} style={{ padding: 0 }}>
            <Loader loading={showLoader}>
              {(showLoader || showIntro) && IntroComponent}
              {showNoResults && NoResultsComponent}
            </Loader>
          </Td>
        </Tr>
      </Tbody>
    </>
  )
}

export default _.flow(observer, withTheme)(TableBody)
