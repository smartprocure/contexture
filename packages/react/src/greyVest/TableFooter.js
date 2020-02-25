import React from 'react'
import _ from 'lodash/fp'
import Pager from './Pager'
import PagerItem from './PagerItem'
import PageSize from './PageSize'
import Flex from './Flex'

let getRange = (firstRecord, lastRecord) =>
  firstRecord >= lastRecord ? lastRecord : `${firstRecord}-${lastRecord}`

let getTotal = (totalRecords, hasMore) =>
  totalRecords ? `of ${totalRecords}${hasMore ? '+' : ''}` : ''

let TableFooter = ({
  page = 1,
  onChangePage,
  pageSize,
  onChangePageSize,
  pageSizeOptions,
  startRecord = pageSize * (page - 1) + 1,
  endRecord = pageSize * page,
  totalRecords = endRecord,
  hasMore,
  ...props
}) => {
  let lastRecord = _.min([totalRecords, endRecord])
  let pageCount = _.ceil(totalRecords / pageSize)
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
        style={{ flex: 1 }}
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
      <span style={{ flex: 1, textAlign: 'right' }}>
        <b>Showing</b> {getRange(startRecord, lastRecord)}{' '}
        {getTotal(totalRecords, hasMore)}
      </span>
    </Flex>
  )
}

export default TableFooter
