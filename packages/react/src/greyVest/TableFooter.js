import React from 'react'
import _ from 'lodash/fp'
import Pager from './Pager'
import PageSize from './PageSize'
import Flex from './Flex'

let showing = (totalRecords, page, pageSize) => {
  let min = _.min([totalRecords, pageSize * (page - 1) + 1])
  let max = _.min([totalRecords, pageSize * page])
  return min >= max ? max : `${min}-${max}`
}

let TableFooter = ({
  page = 1,
  onChangePage,
  pageSize,
  onChangePageSize,
  pageSizeOptions,
  totalRecords = 0,
  hasMore,
  ...props
}) => {
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
        <Pager
          value={page}
          onChange={onChangePage}
          {...{ pageCount, hasMore }}
        />
      </Flex>
      <span style={{ flex: 1, textAlign: 'right' }}>
        <b>Showing</b> {showing(totalRecords, page, pageSize)}
        {!hasMore && ` of ${totalRecords}`}
      </span>
    </Flex>
  )
}

export default TableFooter
