import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from '../utils/hoc'

let ResultPager = ({
  node,
  tree,
  className = '',
  theme: { PagerItem, Icon },
}) => {
  let pages = Math.ceil(
    (node.context.response.totalRecords || 1) / node.pageSize
  )
  let page = node.page || 1
  return (
    pages > 1 && (
      <div className={`${className} contexture-result-pager`}>
        <PagerItem
          disabled={!(page > 1)}
          onClick={() => tree.mutate(node.path, { page: page - 1 })}
        >
          <Icon icon="PreviousPage" />
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
                <PagerItem
                  key={`prev${n}`}
                  onClick={() =>
                    tree.mutate(node.path, { page: page - (n + 1) })
                  }
                >
                  {page - (n + 1)}
                </PagerItem>
              ),
            2
          )
        )}
        <PagerItem active>{page}</PagerItem>
        {_.times(
          n =>
            page + (n + 1) <= pages && (
              <PagerItem
                key={`next${n}`}
                onClick={() => tree.mutate(node.path, { page: page + (n + 1) })}
              >
                {page + (n + 1)}
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
        <PagerItem
          disabled={!(page < pages)}
          onClick={() => tree.mutate(node.path, { page: page + 1 })}
        >
          <Icon icon="NextPage" />
        </PagerItem>
      </div>
    )
  )
}

export default contexturifyWithoutLoader(ResultPager)
