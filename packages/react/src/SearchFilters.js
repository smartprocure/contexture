import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex, QueryBuilder, FilterAdder, FilterList } from '.'
import { TreePauseButton } from './purgatory'
import { LinkButton, Icon, Popover } from './greyVest'
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

let PopOverItem = ({ children, ...props }) => (
  <div style={{ margin: 10, cursor: 'pointer' }} {...props}>
    {children}
  </div>
)

let BasicSearchFilters = ({ setMode, trees, children, BasicFilters }) => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <h1>Filters</h1>
        </Flex>
        <div>
          <Popover
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            style={{ width: 180, right: 0, top: 40 }}
          >
            <PopOverItem onClick={() => setMode('resultsOnly')}>
              Toggle Filters
            </PopOverItem>
            <TreePauseButton children={children} Component={PopOverItem} />
            <PopOverItem onClick={() => setMode('builder')}>
              Advanced Search Builder
            </PopOverItem>
          </Popover>
          <Icon
            style={{ paddingTop: 15, cursor: 'pointer' }}
            icon="more_vert"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </Flex>
      <LabelledList list={trees} Component={BasicFilters} />
    </div>
  )
}

let BuilderSearchFilters = ({ setMode, trees, BuilderFilters }) => (
  <div>
    <Flex justifyContent="space-between" style={{ alignItems: 'center' }}>
      <Flex alignItems="center">
        <h1>Filters</h1>
      </Flex>
      <LinkButton onClick={() => setMode('basic')} style={{ marginRight: 30 }}>
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
