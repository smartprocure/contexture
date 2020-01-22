import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { Grid, GridItem, PagerItem } from '../../greyVest'
import ResultPager from '../ResultPager'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let getTotalRecords = F.cascade([
  'context.response.totalRecords',
  'context.totalRecords',
])

let PageSize = ({
  value,
  onChange = () => {},
  sizeOptions = [20, 50, 100, 250],
}) => (
  <div>
    <span style={{ marginRight: 4 }}>View</span>
    {_.map(
      size => (
        <PagerItem
          style={{ margin: 2, width: 'auto', minWidth: '2em' }}
          key={size}
          active={size === value}
          onClick={() => onChange(size)}
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
  </div>
)

let ResultPageSize = contexturifyWithoutLoader(({ tree, node, ...props }) => (
  <PageSize
    value={node.pageSize}
    onChange={pageSize => {
      tree.mutate(node.path, {
        pageSize,
        page: _.min([node.page, _.ceil(getTotalRecords(node) / pageSize)]),
      })
    }}
    {...props}
  />
))

let ResultTableCount = contexturifyWithoutLoader(({ node, ...props }) => {
  let totalRecords = getTotalRecords(node)
  let { pageSize, page } = node
  return (
    <div {...props}>
      <b>Showing</b> {pageSize * (page - 1) + 1}-
      {_.min([totalRecords, pageSize * page])} of {totalRecords}
    </div>
  )
})

let ResultTableFooter = ({ tree, node, path, sizeOptions, ...props }) => (
  <Grid
    columns={3}
    style={{ paddingTop: 16 }}
    areas={['left middle right']}
    {...props}
  >
    <GridItem
      as={ResultPageSize}
      area="left"
      place="center start"
      {...{ tree, node, path, sizeOptions }}
    />
    <ResultPager {...{ tree, node, path }} />
    <GridItem
      area="right"
      as={ResultTableCount}
      place="center end"
      {...{ tree, node, path }}
    />
  </Grid>
)

export default ResultTableFooter
