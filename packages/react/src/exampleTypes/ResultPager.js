import _ from 'lodash/fp'
import React from 'react'
import { contexturify } from '../utils/hoc'
import DefaultIcon from '../DefaultIcon'

// These are to prevent warning from `active`, `previous`, `next`
let span = ({ children }) => <span>{children}</span>
let a = ({ children, onClick }) => <a onClick={onClick}>{children}</a>

let ResultPager = contexturify(
  ({
    node,
    tree,
    Item = span,
    Link = a,
    Icon = DefaultIcon,
    className = '',
  }) => {
    let pages = Math.ceil(
      (node.context.response.totalRecords || 1) / node.pageSize
    )
    let page = node.page || 1
    return (
      pages > 1 && (
        <div className={`${className} contexture-result-pager`}>
          <Item disabled={!(page > 1)}>
            <Link
              previous
              onClick={() => tree.mutate(node.path, { page: page - 1 })}
            >
              <Icon icon="PreviousPage" />
            </Link>
          </Item>
          {page > 3 && (
            <Item
              onClick={() =>
                tree.mutate(node.path, { page: _.max([0, page - 5]) })
              }
            >
              <Icon icon="Previous5Pages" />
            </Item>
          )}
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
          {page + 2 < pages && (
            <Item
              onClick={() =>
                tree.mutate(node.path, { page: _.min([pages, page + 5]) })
              }
            >
              <Icon icon="Next5Pages" />
            </Item>
          )}
          <Item disabled={!(page < pages)}>
            <Link
              next
              onClick={() => tree.mutate(node.path, { page: page + 1 })}
            >
              <Icon icon="NextPage" />
            </Link>
          </Item>
        </div>
      )
    )
  }
)
ResultPager.displayName = 'ResultPager'

export default ResultPager
