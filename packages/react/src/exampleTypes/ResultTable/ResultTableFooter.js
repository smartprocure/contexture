import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import TableFooter from '../../greyVest/TableFooter'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let ResultTableFooter = ({ tree, node, pageSizeOptions }) => {
  let getFromContext = key =>
    F.cascade([`context.response.${key}`, `context.${key}`], node)
  // We use endRecord as a cheap fallback for totalRecords in case the results node
  // doesn't contain a count (eg. for very expensive queries using contexture-mongo,
  // where the count may be disabled for performance). This lets us use the normal
  // pagination component to navigate back through previous pages.
  let totalRecords =
    getFromContext('totalRecords') || getFromContext('endRecord') || 0
  return (
    <TableFooter
      page={node.page || 1}
      onChangePage={page => tree.mutate(node.path, { page })}
      pageSize={node.pageSize}
      onChangePageSize={pageSize => {
        tree.mutate(node.path, {
          pageSize,
          page: _.min([node.page, _.ceil(totalRecords / pageSize)]),
        })
      }}
      pageSizeOptions={pageSizeOptions}
      totalRecords={totalRecords}
      hasMore={getFromContext('hasMore')}
    />
  )
}

export default contexturifyWithoutLoader(ResultTableFooter)
