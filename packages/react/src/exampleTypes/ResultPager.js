import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'

// These are to prevent warning from `active`, `previous`, `next`
let span = ({ children }) => <span>{children}</span>
let a = ({ children, onClick }) => <a onClick={onClick}>{children}</a>

let ResultPager = InjectTreeNode(
  observer(({ node, tree, List = 'div', Item = span, Link = a }) => {
    let pages = Math.ceil(
      (node.context.response.totalRecords || 1) / node.pageSize
    )
    let page = node.page || 1
    return (
      <List>
        <Item disabled={!(page > 1)}>
          <Link
            previous
            onClick={() => tree.mutate(node.path, { page: page - 1 })}
          >
            {'<'}
          </Link>
        </Item>
        {_.reverse(
          _.times(
            n =>
              page > n + 1 && (
                <Item key={`prev${n}`}>
                  <Link
                    onClick={() =>
                      tree.mutate(node.path, { page: page - (n + 1) })
                    }
                  >
                    {page - (n + 1)}
                  </Link>
                </Item>
              ),
            2
          )
        )}
        <Item active>
          <Link>{page}</Link>
        </Item>
        {_.times(
          n =>
            page + (n + 1) <= pages && (
              <Item key={`next${n}`}>
                <Link
                  onClick={() =>
                    tree.mutate(node.path, { page: page + (n + 1) })
                  }
                >
                  {page + (n + 1)}
                </Link>
              </Item>
            ),
          2
        )}
        <Item disabled={!(page < pages)}>
          <Link next onClick={() => tree.mutate(node.path, { page: page + 1 })}>
            {'>'}
          </Link>
        </Item>
      </List>
    )
  })
)
ResultPager.displayName = 'ResultPager'

export default ResultPager