import React from 'react'
import _ from 'lodash/fp.js'
import GVPagerItem from './PagerItem.js'
import Flex from './Flex.js'

let PageSize = ({
  value,
  onChange = () => {},
  sizeOptions = [10, 20, 50, 100, 250],
  PagerItem = GVPagerItem,
  ...props
}) => (
  <Flex alignItems="baseline" {...props}>
    <span style={{ marginRight: 4, fontWeight: 'bold' }}>View</span>
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
      _.flow(_.concat(value), _.sortBy(_.identity), _.sortedUniq)(sizeOptions)
    )}
  </Flex>
)

export default PageSize
