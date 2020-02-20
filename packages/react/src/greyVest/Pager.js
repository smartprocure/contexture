import _ from 'lodash/fp'
import React from 'react'
import GVPagerItem from './PagerItem'
import GVIcon from './Icon'
import Flex from './Flex'

let Pager = ({
  value,
  onChange = () => {},
  hasMore,
  pageCount,
  PagerItem = GVPagerItem,
  Icon = GVIcon,
}) => (
  <Flex justifyContent="center" alignItems="center">
    {value > 1 && (
      <PagerItem onClick={() => onChange(value - 1)}>
        <Icon icon="PreviousPage" />
      </PagerItem>
    )}
    {value > 3 && (
      <PagerItem onClick={() => onChange(_.max([0, value - 5]))}>
        <Icon icon="Previous5Pages" />
      </PagerItem>
    )}
    {_.reverse(
      _.times(
        n =>
          value > n + 1 && (
            <PagerItem
              key={`prev${n}`}
              onClick={() => onChange(value - (n + 1))}
            >
              {value - (n + 1)}
            </PagerItem>
          ),
        2
      )
    )}
    {pageCount > 1 && <PagerItem active>{value}</PagerItem>}
    {_.times(
      n =>
        value + (n + 1) <= pageCount && (
          <PagerItem key={`next${n}`} onClick={() => onChange(value + (n + 1))}>
            {value + (n + 1)}
          </PagerItem>
        ),
      2
    )}
    {value + 2 < pageCount && (
      <PagerItem onClick={() => onChange(_.min([pageCount, value + 5]))}>
        <Icon icon="Next5Pages" />
      </PagerItem>
    )}
    {value < pageCount && (
      <PagerItem onClick={() => onChange(value + 1)}>
        <Icon icon="NextPage" />
      </PagerItem>
    )}
    {hasMore && value === pageCount && (
      <PagerItem
        style={{ padding: '6px 12px' }}
        onClick={() => onChange(value + 1)}
      >
        Load More...
      </PagerItem>
    )}
  </Flex>
)

export default Pager
