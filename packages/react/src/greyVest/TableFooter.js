import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import Pager from './Pager'
import PagerItem from './PagerItem'
import PageSize from './PageSize'
import Flex from './Flex'
import { toNumber } from '../utils/format'

let PageDetails = ({ startRecord, endRecord, totalRecords, hasMore }) => (
  <span style={{ flex: '0 1 30%', textAlign: 'right' }}>
    <b>Showing </b>
    {startRecord >= endRecord ? endRecord : `${toNumber(startRecord)}-${toNumber(endRecord)}`}
    {F.isNotNil(totalRecords) && ` of ${toNumber(totalRecords)}${hasMore ? '+' : ''}`}
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
  ...props
}) => {
  // if endRecord isn't given, approximate it from totalRecords
  if (totalRecords)
    endRecord = endRecord || _.min([page * pageSize, totalRecords])
  if (!hasMore && !totalRecords) totalRecords = endRecord
  let pageCount = _.ceil((totalRecords || endRecord) / pageSize)
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      style={{ padding: 8 }}
      {...props}
    >
      <PageSize
        sizeOptions={pageSizeOptions}
        value={pageSize}
        onChange={onChangePageSize}
        style={{ flex: '0 1 30%' }}
      />
      <Flex style={{ flex: 1 }} alignItems="center" justifyContent="center">
        <Pager value={page} onChange={onChangePage} pageCount={pageCount} />
        {hasMore && page >= pageCount && (
          <PagerItem
            style={{ margin: '0 8px', paddingLeft: 12, paddingRight: 12 }}
            onClick={() => onChangePage(page + 1)}
          >
            Load More...
          </PagerItem>
        )}
      </Flex>
      <PageDetails {...{ totalRecords, startRecord, endRecord, hasMore }} />
    </Flex>
  )
}

export default TableFooter
