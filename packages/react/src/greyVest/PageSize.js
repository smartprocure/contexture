import React from 'react'
import _ from 'lodash/fp'
import GVPagerItem from './PagerItem'
import Flex from './Flex'

let PageSize = ({
  value,
  onChange = () => {},
  sizeOptions = [20, 50, 100, 250],
  PagerItem = GVPagerItem,
  ...props
}) => (
  <Flex alignItems="baseline" {...props}>
    <span css={{ marginRight: 4, fontWeight: 'bold' }}>View</span>
    {_.map(
      size => (
        <PagerItem
          key={size}
          active={size === value}
          onClick={() => onChange(size)}
          css={{ margin: 2 }}
        >
          {size}
        </PagerItem>
      ),
      _.flow(
        _.concat(value),
        _.sortBy(_.identity),
        _.sortedUniq
      )(sizeOptions)
    )}
  </Flex>
)

export default PageSize
