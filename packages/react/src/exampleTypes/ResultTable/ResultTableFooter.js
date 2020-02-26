import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import TableFooter from '../../greyVest/TableFooter'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let ResultTableFooter = ({ tree, node, pageSizeOptions }) => {
  let getFromContext = key =>
    F.cascade([`context.response.${key}`, `context.${key}`], node)
  return (
    <TableFooter
      page={node.page || 1}
      onChangePage={page => tree.mutate(node.path, { page })}
      pageSize={node.pageSize}
      onChangePageSize={pageSize => {
        tree.mutate(node.path, {
          pageSize,
          page: _.ceil((getFromContext('startRecord') || 0) / pageSize) || 1,
        })
      }}
      pageSizeOptions={pageSizeOptions}
      {...F.arrayToObject(x => x, getFromContext, [
        'hasMore',
        'totalRecords',
        'startRecord',
        'endRecord',
      ])}
    />
  )
}

export default contexturifyWithoutLoader(ResultTableFooter)
