import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex, QueryBuilder, FilterAdder, FilterList } from '.'
import { TreePauseButton } from './purgatory'
import { LinkButton, Icon, Popover, DropdownItem } from './greyVest'
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
    <FilterAdder {...props} uniqueFields={!props.allowDuplicateFields} />
  </>
)

export let FiltersBox = withTheme(({ theme: { Box }, ...props }) => (
  <Box className="filter-list">
    <AddableFilterList {...props} />
  </Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = ({ setMode, trees, children, BasicFilters }) => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <h1>Filters</h1>
        <div>
          <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DropdownItem onClick={() => setMode('resultsOnly')}>
              Hide Filters
            </DropdownItem>
            <TreePauseButton children={children} Component={DropdownItem} />
            <DropdownItem onClick={() => setMode('builder')}>
              Advanced Search Builder
            </DropdownItem>
          </Popover>
          <DropdownItem onClick={() => setIsOpen(true)}>
            <Icon icon="more_vert" />
          </DropdownItem>
        </div>
      </Flex>
      <LabelledList list={trees} Component={BasicFilters} />
    </div>
  )
}

let BuilderSearchFilters = ({ setMode, trees, BuilderFilters }) => (
  <div>
    <Flex alignItems="center" justifyContent="space-between">
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
  children, // pass allowDuplicateFields in children to override uniqueFields
  BasicFilters = FiltersBox,
  BuilderFilters = QueryBuilder,
}) => {
  let trees = _.flow(React.Children.toArray, _.map('props'))(children)
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
