import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { Flex, QueryBuilder, FilterAdder, FilterList } from '.'
import TreePauseButton from './greyVest/TreePauseButton'
import ToggleFiltersButton from './greyVest/ToggleFiltersButton'
import { withTheme } from './utils/theme'

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

export let FiltersBox = withTheme(({ theme, ...props }) => (
  <theme.Box className="filter-list">
    <AddableFilterList {...props} />
  </theme.Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = withTheme(
  ({ theme: { Link }, setMode, trees, children }) => (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <h1>Filters</h1>
        <TreePauseButton children={children} />
        <ToggleFiltersButton onClick={() => setMode('resultsOnly')} />
      </Flex>
      <LabelledList list={trees} Component={FiltersBox} />
      <Link onClick={() => setMode('builder')} style={{ marginTop: 15 }}>
        Switch to Advanced Search Builder
      </Link>
    </div>
  )
)
BasicSearchFilters.displayName = 'BasicSearchFilters'

let BuilderSearchFilters = withTheme(({ theme: { Link }, setMode, trees }) => (
  <div>
    <Flex style={{ alignItems: 'center' }}>
      <h1>Filters</h1>
      <Link onClick={() => setMode('basic')}>Back to Regular Search</Link>
    </Flex>
    <LabelledList list={trees} Component={QueryBuilder} />
  </div>
))
BuilderSearchFilters.displayName = 'BuilderSearchFilters'

let SearchFilters = ({ mode, setMode, children }) => {
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  return mode === 'basic' ? (
    <BasicSearchFilters {...{ trees, setMode, children }} />
  ) : mode === 'builder' ? (
    <BuilderSearchFilters {...{ trees, setMode }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
