import _ from 'lodash/fp'
import React from 'react'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

let ResultPager = ({
  node,
  tree,
  theme: { PagerItem, Link, Icon },
  className = '',
}) => {
  let pages = Math.ceil(
    (node.context.response.totalRecords || 1) / node.pageSize
  )
  let page = node.page || 1
  return (
    pages > 1 && (
      <div className={`${className} contexture-result-pager`}>
        <PagerItem disabled={!(page > 1)}>
          <Link
            previous
            onClick={() => tree.mutate(node.path, { page: page - 1 })}
          >
            <Icon icon="PreviousPage" />
          </Link>
        </PagerItem>
        {page > 3 && (
          <PagerItem
            onClick={() =>
              tree.mutate(node.path, { page: _.max([0, page - 5]) })
            }
          >
            <Icon icon="Previous5Pages" />
          </PagerItem>
        )}
        {_.reverse(
          _.times(
            n =>
              page > n + 1 && (
                <PagerItem key={`prev${n}`}>
                  <Link
                    onClick={() =>
                      tree.mutate(node.path, { page: page - (n + 1) })
                    }
                  >
                    {page - (n + 1)}
                  </Link>
                </PagerItem>
              ),
            2
          )
        )}
        <PagerItem active>
          <Link>{page}</Link>
        </PagerItem>
        {_.times(
          n =>
            page + (n + 1) <= pages && (
              <PagerItem key={`next${n}`}>
                <Link
                  onClick={() =>
                    tree.mutate(node.path, { page: page + (n + 1) })
                  }
                >
                  {page + (n + 1)}
                </Link>
              </PagerItem>
            ),
          2
        )}
        {page + 2 < pages && (
          <PagerItem
            onClick={() =>
              tree.mutate(node.path, { page: _.min([pages, page + 5]) })
            }
          >
            <Icon icon="Next5Pages" />
          </PagerItem>
        )}
        <PagerItem disabled={!(page < pages)}>
          <Link next onClick={() => tree.mutate(node.path, { page: page + 1 })}>
            <Icon icon="NextPage" />
          </Link>
        </PagerItem>
      </div>
    )
  )
}

export default _.flow(
  contexturify,
  withTheme
)(ResultPager)
