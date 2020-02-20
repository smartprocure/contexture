import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import TableFooter from '../../greyVest/TableFooter'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let getFromContext = _.curry((key, obj) =>
  F.cascade([`context.response.${key}`, `context.${key}`], obj)
)

let ResultTableFooter = ({ tree, node, pageSizeOptions }) => {
  // We keep track of a running totalRecords in case the results node doesn't
  // contain a count (eg. for very expensive queries using contexture-mongo,
  // where the count may be disabled for performance).
  let totalRecords = React.useRef(0)
  totalRecords.current = _.max([
    totalRecords.current,
    getFromContext('totalRecords', node),
    getFromContext('endRecord', node),
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
      hasMore={node.skipCount}
    />
  )
}

export default contexturifyWithoutLoader(ResultTableFooter)
