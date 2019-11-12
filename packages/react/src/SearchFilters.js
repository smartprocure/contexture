import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex, QueryBuilder, FilterAdder, FilterList } from '.'
import { ToggleFiltersButton, TreePauseButton } from './purgatory'
import { LinkButton } from './greyVest'
import { withTheme } from './utils/theme'

export let SearchTree = () => {}

let LabelledList = ({ list, Component }) =>
  F.mapIndexed(
    ({ label, ...props }, i) => (
      <React.Fragment key={i}>
        {label && <h3>{label}</h3>}
        <Component {...props} />
      </React.Fragment>
    ),
    list
  )

export let AddableFilterList = props => (
  <>
    <FilterList {...props} />
    <FilterAdder {...props} uniqueFields />
  </>
)

export let FiltersBox = withTheme(({ theme: { Box }, ...props }) => (
  <Box className="filter-list">
    <AddableFilterList {...props} />
  </Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = ({ setMode, trees, children, BasicFilters }) => (
  <div>
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <h1>Filters</h1>
        <ToggleFiltersButton onClick={() => setMode('resultsOnly')} />
      </Flex>
      <div>
        <TreePauseButton children={children} />
      </div>
    </Flex>
    <LabelledList list={trees} Component={BasicFilters} />
    <LinkButton onClick={() => setMode('builder')} style={{ marginTop: 15 }}>
      Switch to Advanced Search Builder
    </LinkButton>
  </div>
)

let BuilderSearchFilters = ({ setMode, trees, BuilderFilters }) => (
  <div>
    <Flex style={{ alignItems: 'center' }}>
      <h1>Filters</h1>
      <LinkButton onClick={() => setMode('basic')}>
        Back to Regular Search
      </LinkButton>
    </Flex>
    <LabelledList list={trees} Component={BuilderFilters} />
  </div>
)

let SearchFilters = ({
  mode,
  setMode,
  children,
  BasicFilters = FiltersBox,
  BuilderFilters = QueryBuilder,
}) => {
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  return mode === 'basic' ? (
    <BasicSearchFilters {...{ trees, setMode, children, BasicFilters }} />
  ) : mode === 'builder' ? (
    <BuilderSearchFilters {...{ trees, setMode, BuilderFilters }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
