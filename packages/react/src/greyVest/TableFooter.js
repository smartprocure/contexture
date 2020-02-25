import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import Pager from './Pager'
import PagerItem from './PagerItem'
import PageSize from './PageSize'
import Flex from './Flex'

let PageDetails = ({ startRecord, endRecord, totalRecords, hasMore }) => (
  <span style={{ flex: '0 1 30%', textAlign: 'right' }}>
    <b>Showing </b>
    {startRecord >= endRecord ? endRecord : `${startRecord}-${endRecord}`}
    {F.isNotNil(totalRecords) && ` of ${totalRecords}${hasMore ? '+' : ''}`}
  </span>
)

// Accepts either `totalRecords` or 
let TableFooter = ({
  page = 1,
  onChangePage,
  pageSize,
  onChangePageSize,
  pageSizeOptions,
  hasMore,
  totalRecords,
  startRecord = pageSize * (page - 1) + 1,
  endRecord = totalRecords ? _.min([totalRecords, pageSize * page]) : 0,
  ...props
}) => {
  totalRecords = totalRecords || (hasMore ? undefined : endRecord)
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
