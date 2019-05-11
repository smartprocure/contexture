import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { Flex } from '../../'
import LinkButton from './LinkButton'
import TreePauseButton from './TreePauseButton'
import ToggleFiltersButton from './ToggleFiltersButton'

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

let BasicSearchFilters = ({ setMode, trees, children, FiltersBox }) => (
  <div>
    <Flex style={{ alignItems: 'center' }}>
      <h1>Filters</h1>
      <TreePauseButton children={children} />
      <ToggleFiltersButton onClick={() => setMode('resultsOnly')} />
    </Flex>
    <LabelledList list={trees} Component={FiltersBox} />
    <LinkButton onClick={() => setMode('builder')} style={{ marginTop: 15 }}>
      Switch to Advanced Search Builder
    </LinkButton>
  </div>
)
let BuilderSearchFilters = ({ setMode, trees, QueryBuilder }) => (
  <div>
    <Flex style={{ alignItems: 'center' }}>
      <h1>Filters</h1>
      <LinkButton onClick={() => setMode('basic')}>
        Back to Regular Search
      </LinkButton>
    </Flex>
    <LabelledList list={trees} Component={QueryBuilder} />
  </div>
)

let SearchFilters = ({ mode, setMode, children, QueryBuilder, FiltersBox }) => {
  let trees = _.flow(React.Children.toArray, _.map('props'))(children)
  if (mode === 'resultsOnly') return null
  if (mode === 'basic')
    return <BasicSearchFilters {...{ trees, setMode, children, FiltersBox }} />
  if (mode === 'builder')
    return <BuilderSearchFilters {...{ trees, setMode, QueryBuilder }} />
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
