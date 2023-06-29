import React from 'react'
import _ from 'lodash/fp.js'
import PropTypes from 'prop-types'
import F from 'futil'
import { observer } from 'mobx-react'
import FilterList from './FilterList.js'
import FilterAdder from './FilterAdder.js'
import QueryBuilder from './queryBuilder/index.js'
import { TreePauseButton } from './purgatory/index.js'
import { Flex, LinkButton, Popover, DropdownItem } from './greyVest/index.js'
import { withTheme } from './utils/theme.js'

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

export let AddableFilterList = (props) => (
  <>
    <FilterList {...props} />
    <FilterAdder {...props} uniqueFields={!props.allowDuplicateFields} />
  </>
)

export let FiltersBox = withTheme(({ theme: { Box }, ...props }) => (
  <Box className="filter-list">
    <AddableFilterList {...props} />
  </Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = withTheme(
  ({
    setMode,
    disableAdvancedMode,
    trees,
    children,
    BasicFilters,
    theme: { Icon },
  }) => (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <h1>Filters</h1>
        <div>
          <Popover
            position="bottom right"
            trigger={
              <DropdownItem>
                <Icon icon="TableColumnMenu" />
              </DropdownItem>
            }
          >
            {setMode && (
              <DropdownItem onClick={() => setMode('resultsOnly')}>
                Hide Filters
              </DropdownItem>
            )}
            <TreePauseButton Component={DropdownItem}>
              {children}
            </TreePauseButton>
            {setMode && !disableAdvancedMode && (
              <DropdownItem onClick={() => setMode('builder')}>
                Advanced Search Builder
              </DropdownItem>
            )}
          </Popover>
        </div>
      </Flex>
      <LabelledList list={trees} Component={BasicFilters} />
    </div>
  )
)

let BuilderSearchFilters = ({ setMode, trees, BuilderFilters }) => (
  <div>
    <Flex alignItems="center" justifyContent="space-between">
      <h1>Filters</h1>
      {setMode && (
        <LinkButton onClick={() => setMode('basic')}>
          Back to Regular Search
        </LinkButton>
      )}
    </Flex>
    <LabelledList list={trees} Component={BuilderFilters} />
  </div>
)

let SearchFilters = ({
  mode,
  setMode,
  disableAdvancedMode,
  children, // pass allowDuplicateFields in children to override uniqueFields
  BasicFilters = FiltersBox,
  BuilderFilters = QueryBuilder,
}) => {
  let trees = _.flow(React.Children.toArray, _.map('props'))(children)
  return mode === 'basic' ? (
    <BasicSearchFilters
      {...{ trees, setMode, disableAdvancedMode, children, BasicFilters }}
    />
  ) : mode === 'builder' ? (
    <BuilderSearchFilters {...{ trees, setMode, BuilderFilters }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
