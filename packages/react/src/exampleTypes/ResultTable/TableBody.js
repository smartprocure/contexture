import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema'
import HighlightedColumn from './HighlightedColumn'
import { addBlankRows, blankResult } from '../../utils/format'
import { withTheme } from '../../utils/theme'
import { StripedLoader } from '../../greyVest'

let displayCell = (display, field, result) => {
  let record = getRecord(result)
  let data = _.get(field, record)
  if (result.isBlank) return blankResult(display)(data, record)
  data = display(data, record)
  if (_.isString(data))
    return <span dangerouslySetInnerHTML={{ __html: data }} />
  return data
}

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
          display: showIntro || showLoader || showNoResults ? 'none' : '',
        }}
      >
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
                        left: field === stickyColumn ? 0 : '',
                      }}
                    >
                      {displayCell(display, field, x)}
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
