import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import TableFooter from '../../greyVest/TableFooter'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let ResultTableFooter = ({ tree, node, pageSizeOptions }) => {
  let getFromContext = key =>
    F.cascade([`context.response.${key}`, `context.${key}`], node)
  // We keep track of a running totalRecords in case the results node doesn't
  // contain a count (eg. for very expensive queries using contexture-mongo,
  // where the count may be disabled for performance).
  let totalRecords = React.useRef(0)
  totalRecords.current = _.max([
    totalRecords.current,
    getFromContext('totalRecords'),
    getFromContext('endRecord'),
  ])
  return (
    <TableFooter
      page={node.page || 1}
      onChangePage={page => tree.mutate(node.path, { page })}
      pageSize={node.pageSize}
      onChangePageSize={pageSize => {
        tree.mutate(node.path, {
          pageSize,
          page: _.min([node.page, _.ceil(totalRecords.current / pageSize)]),
        })
      }}
      pageSizeOptions={pageSizeOptions}
      totalRecords={totalRecords.current}
      hasMore={getFromContext('hasMore')}
    />
  )
}

export default contexturifyWithoutLoader(ResultTableFooter)
