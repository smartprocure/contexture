import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from '../utils/hoc'
import { Pager, Flex } from '../greyVest'

let getFromContext = (key, node) =>
  F.cascade([`context.${key}`, `context.response.${key}`], node)

let ResultPager = ({ node, tree, theme: { PagerItem, Icon }, ...props }) => {
  let totalRecords = React.useRef(getFromContext('totalRecords', node))
  let endRecord = getFromContext('endRecord', node)

  totalRecords.current = _.max([totalRecords.current, endRecord])
  console.log({
    totalRecords: totalRecords.current,
    endRecord,
    res: node.context.response,
  })

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
      {endRecord >= totalRecords.current && (
        <PagerItem
          onClick={() => {
            tree.mutate(node.path, { page: page + 1 })
            // setTotalRecords(records => _.max([records, endRecord]))
          }}
        >
          More...
        </PagerItem>
      )}
    </Flex>
  )
}

export default contexturifyWithoutLoader(ResultPager)
