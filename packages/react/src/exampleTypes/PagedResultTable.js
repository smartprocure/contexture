import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { Grid, GridItem, PagerItem } from '../greyVest/'
import ResultPager from './ResultPager'
import ResultTable from './ResultTable'
import { contexturifyWithoutLoader } from '../utils/hoc'

let PageSize = ({
  value,
  onChange = () => {},
  sizeOptions = [20, 50, 100, 250],
}) => (
  <div>
    View
    {_.map(
      size => (
        <PagerItem
          style={{ margin: 4, width: 'auto', minWidth: '2em' }}
          key={size}
          active={size === value}
          onClick={() => onChange(size)}
        >
          {size}
        </PagerItem>
      ),
      _.flow(_.concat(value), _.sortBy(_.identity), _.sortedUniq)(sizeOptions)
    )}
  </div>
)

let ResultPageSize = contexturifyWithoutLoader(({ tree, node, ...props }) => (
  <PageSize
    value={_.getOr(10, 'pageSize', node)}
    onChange={pageSize => tree.mutate(node.path, { pageSize })}
    {...props}
  />
))

let ResultPageDetails = contexturifyWithoutLoader(({ node, ...props }) => {
  let { totalRecords } = F.cascade(['context.response', 'context'], node)
  let { pageSize, page } = node
  return (
    <div {...props}>
      <b>Showing</b> {pageSize * (page - 1) + 1}-
      {_.min([totalRecords, pageSize * page])} of {totalRecords}
    </div>
  )
})

let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ResultTable {...{ tree, node, path, ...props }} />
    <Grid columns={3} style={{ paddingTop: 16 }}>
      <ResultPageSize {...{ tree, node, path }} />
      <ResultPager {...{ tree, node, path }} />
      <GridItem
        as={ResultPageDetails}
        place="center end"
        {...{ tree, node, path }}
      />
    </Grid>
  </>
)
export default PagedResultTable
