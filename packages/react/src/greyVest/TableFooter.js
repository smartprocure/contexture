import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import Pager from './Pager.js'
import PagerItem from './PagerItem.js'
import PageSize from './PageSize.js'
import Flex from './Flex.js'
import { toNumber } from '../utils/format.js'

let PageDetails = ({ startRecord, endRecord, totalRecords, hasMore }) => (
  <span style={{ flex: '0 1 30%', textAlign: 'right' }}>
    <b>Showing </b>
    {startRecord >= endRecord
      ? endRecord
      : `${toNumber(startRecord)}-${toNumber(endRecord)}`}
    {F.isNotNil(totalRecords) &&
      ` of ${toNumber(totalRecords)}${hasMore ? '+' : ''}`}
  </span>
)

// Requires either `totalRecords` or `hasMore` to do pagination properly.
// `hasMore` is a flag signifying that there is at least one page of records
// after the current one; it allows us to support some pagination functionality
// even when `totalRecords` is not given (eg. for APIs that return paginated
// results without a total count).
let TableFooter = ({
  page = 1,
  onChangePage,
  pageSize,
  onChangePageSize,
  pageSizeOptions,
  hasMore,
  totalRecords,
  startRecord = pageSize * (page - 1) + 1,
  endRecord = hasMore ? page * pageSize : 0,
  disabled = false,
  ...props
}) => {
  // if endRecord isn't given, approximate it from totalRecords
  if (totalRecords)
    endRecord = endRecord || _.min([page * pageSize, totalRecords])
  if (!hasMore && !totalRecords) totalRecords = endRecord
  let pageCount = _.ceil((totalRecords || endRecord) / pageSize)
  return (
    <Flex
      className="gv-table-footer"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    >
      <PageSize
        sizeOptions={pageSizeOptions}
        value={pageSize}
        onChange={onChangePageSize}
        style={{ flex: '0 1 30%' }}
      />
      <Flex style={{ flex: 1 }} alignItems="center" justifyContent="center">
        <Pager
          disabled={disabled}
          value={page}
          onChange={onChangePage}
          pageCount={pageCount}
        />
        {hasMore && page >= pageCount && (
          <PagerItem
            disabled={disabled}
            style={{ margin: '0 8px', paddingLeft: 12, paddingRight: 12 }}
            onClick={() => onChangePage(page + 1)}
          >
            Load More...
          </PagerItem>
        )}
      </Flex>
      {totalRecords > 0 && (
        <PageDetails {...{ totalRecords, startRecord, endRecord, hasMore }} />
      )}
    </Flex>
  )
}

export default TableFooter
