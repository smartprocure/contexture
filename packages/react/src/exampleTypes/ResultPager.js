import F from 'futil'
import React from 'react'
import { contexturifyWithoutLoader } from '../utils/hoc'
import { Pager } from '../greyVest'

let ResultPager = ({ node, tree, theme: { PagerItem, Icon } }) => {
  let pages = Math.ceil(
    F.cascade(['response.totalRecords', 'totalRecords'], node.context, 1) /
      node.pageSize
  )
  let page = node.page || 1
  return (
    <Pager
      value={page}
      pageCount={pages}
      onChange={page => tree.mutate(node.path, { page })}
      {...{ PagerItem, Icon }}
    />
  )
}

export default contexturifyWithoutLoader(ResultPager)
