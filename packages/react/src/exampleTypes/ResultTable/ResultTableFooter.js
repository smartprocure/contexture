import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import TableFooter from '../../greyVest/TableFooter.js'
import { observer } from 'mobx-react'

let ResultTableFooter = ({ tree, node, pageSizeOptions, disabled, style }) => {
  let getFromContext = (key) =>
    F.cascade([`context.response.${key}`, `context.${key}`], node)
  return (
    <TableFooter
      disabled={disabled}
      page={node.page || 1}
      onChangePage={(page) => tree.mutate(node.path, { page })}
      pageSize={node.pageSize}
      onChangePageSize={(pageSize) => {
        tree.mutate(node.path, {
          pageSize,
          page: _.ceil((getFromContext('startRecord') || 0) / pageSize) || 1,
        })
      }}
      pageSizeOptions={pageSizeOptions}
      style={style}
      {...F.arrayToObject((x) => x, getFromContext, [
        'hasMore',
        'totalRecords',
        'startRecord',
        'endRecord',
      ])}
    />
  )
}

export default observer(ResultTableFooter)
