import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Dynamic } from '../../greyVest'
import { withTheme } from '../../utils/theme'

const moveColumn = (
  mutate,
  computeNextIndex,
  field,
  visibleFields,
  includes
) => {
  let visibleFieldIndex = _.findIndex({ field }, visibleFields)
  let nextField = _.flow(
    _.nth(computeNextIndex(visibleFieldIndex)),
    _.get('field')
  )(visibleFields)
  mutate({
    include: F.moveIndex(
      _.indexOf(field, includes),
      _.indexOf(nextField, includes),
      includes
    ),
  })
}

const addColumn = (
  mutate,
  computeSideIndex,
  includes,
  addColumnField,
  field
) => {
  let index = includes.indexOf(addColumnField)
  if (index >= 0) {
    includes.splice(computeSideIndex(index), 0, field)
    mutate({ include: includes })
  }
}

let popoverStyle = {
  userSelect: 'none',
}

let HeaderCellDefault = _.flow(
  setDisplayName('HeaderCell'),
  observer
)(({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
))

let Header = ({
  field: fieldSchema,
  includes,
  addOptions,
  addFilter,
  tree,
  node,
  mutate,
  criteria,
  mapNodeToProps,
  fields,
  visibleFields,
  theme: {
    DropdownItem,
    Icon,
    Popover,
    Modal,
    NestedPicker,
    UnmappedNodeComponent,
  },
}) => {
  let popover = React.useState(false)
  let adding = React.useState(false)
  let [addColumnField, setAddColumnField] = React.useState(null)
  let filtering = React.useState(false)
  let {
    disableFilter,
    disableSort,
    field,
    sortField = field,
    label,
    hideMenu,
    typeDefault,
  } = fieldSchema
  let HeaderCell = fieldSchema.HeaderCell || HeaderCellDefault
  let filterNode =
    criteria &&
    _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
  let filter = () => {
    if (!filterNode) addFilter(field)
    filterNode =
      criteria &&
      _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
    tree.mutate(filterNode.path, { paused: false })
    F.flip(filtering)()
  }
  let Label = label
  return (
    <HeaderCell
      style={{ cursor: 'pointer' }}
      activeFilter={_.get('hasValue', filterNode)}
    >
      <span onClick={F.flip(popover)}>
        {_.isFunction(label) ? <Label /> : label}{' '}
        {field === node.sortField && (
          <Icon
            icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
          />
        )}
        {hideMenu ? null : <Icon icon="TableColumnMenu" />}
      </span>
      <Popover
        open={{
          get() {
            return F.view(popover)
          },
          set(x) {
            // Only turn off the popover if adding is not true
            if (!F.view(adding) && _.isBoolean(x)) F.set(x)(popover)
          },
        }}
        style={popoverStyle}
      >
        {!disableSort && (
          <DropdownItem
            onClick={() => {
              F.off(popover)()
              mutate({ sortField, sortDir: 'asc' })
            }}
          >
            <Icon icon="SortAscending" />
            Sort Ascending
          </DropdownItem>
        )}
        {!disableSort && (
          <DropdownItem
            onClick={() => {
              F.off(popover)()
              mutate({ sortField, sortDir: 'desc' })
            }}
          >
            <Icon icon="SortDescending" />
            Sort Descending
          </DropdownItem>
        )}
        <DropdownItem
          onClick={() =>
            moveColumn(mutate, i => i - 1, field, visibleFields, includes)
          }
        >
          <Icon icon="MoveLeft" />
          Move Left
        </DropdownItem>
        <DropdownItem
          onClick={() =>
            moveColumn(mutate, i => i + 1, field, visibleFields, includes)
          }
        >
          <Icon icon="MoveRight" />
          Move Right
        </DropdownItem>
        <DropdownItem
          onClick={() => mutate({ include: _.without([field], includes) })}
        >
          <Icon icon="RemoveColumn" />
          Remove Column
        </DropdownItem>
        {!!addOptions.length && (
          <DropdownItem
            onClick={() => {
              setAddColumnField(field)
              F.on(adding)()
            }}
          >
            <Icon icon="AddColumn" />
            Add Column
          </DropdownItem>
        )}
        {criteria && (typeDefault || filterNode) && !disableFilter && (
          <div>
            <DropdownItem onClick={filter}>
              <Icon
                icon={
                  filterNode
                    ? F.view(filtering)
                      ? 'FilterCollapse'
                      : 'FilterExpand'
                    : 'FilterAdd'
                }
              />
              Filter
            </DropdownItem>
            {F.view(filtering) && filterNode && !filterNode.paused && (
              <Dynamic
                {...{
                  component: UnmappedNodeComponent,
                  tree,
                  path: _.toArray(filterNode.path),
                  ...mapNodeToProps(filterNode, fields),
                }}
              />
            )}
          </div>
        )}
        <Modal open={adding}>
          <NestedPicker
            options={addOptions}
            onChange={field => {
              addColumn(
                mutate,
                i => i + 1, // Add to the right of the clicked column
                includes,
                addColumnField,
                field
              )
              F.off(adding)()
            }}
          />
        </Modal>
      </Popover>
    </HeaderCell>
  )
}

export default _.flow(
  observer,
  withTheme
)(Header)
