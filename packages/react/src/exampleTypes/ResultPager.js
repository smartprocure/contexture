import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from '../utils/hoc'
import { Pager, Flex } from '../greyVest'

let ResultPager = ({ node, tree, theme: { PagerItem, Icon }, ...props }) => {
  let pages = Math.ceil((totalRecords.current || 1) / (node.pageSize || 1))
  let page = node.page || 1
  return (
    <Flex alignItems="center" {...props}>
      <Pager
        value={page}
        pageCount={pages}
        onChange={page => tree.mutate(node.path, { page })}
        {...{ PagerItem, Icon }}
      />
      
    </Flex>
  )
}

export default contexturifyWithoutLoader(ResultPager)
