import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { contexturify } from '../utils/hoc'
import { Dynamic } from '../greyVest'

import { fieldsToOptions } from '../FilterAdder'
import {
  applyDefaults,
  getRecord,
  getResults,
  inferSchema,
} from '../utils/schema'
import { newNodeFromField } from '../utils/search'
import { withTheme } from '../utils/theme'

let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

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

let popoverStyle = {
  userSelect: 'none',
}

let HighlightedColumnHeader = _.flow(
  setDisplayName('HighlightedColumnHeader'),
  observer
)(
  ({
    node,
    results = _.result('slice', getResults(node)),
    Cell = 'th',
    hasAdditionalFields = !_.flow(
      _.map('additionalFields'),
      _.compact,
      _.isEmpty
    )(results),
  }) =>
    hasAdditionalFields && node.showOtherMatches ? (
      <Cell key="additionalFields">Other Matches</Cell>
    ) : null
)

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

let HighlightedColumn = _.flow(
  setDisplayName('HighlightedColumn'),
  observer,
  withTheme
)(
  ({
    node,
    results = _.result('slice', getResults(node)),
    additionalFields = _.result('0.additionalFields.slice', results),
    schema,
    Cell = 'td',
    theme: { Modal, Table },
  }) => {
    let viewModal = React.useState(false)
    return _.isEmpty(additionalFields) ? (
      <Cell key="additionalFields" />
    ) : (
      <Cell key="additionalFields">
        <Modal open={viewModal}>
          <h3>Other Matching Fields</h3>
          <Table>
            <tbody>
              {_.map(
                ({ label, value }) => (
                  <tr key={label}>
                    <td>{labelForField(schema, label)}</td>
                    <td dangerouslySetInnerHTML={{ __html: value }} />
                  </tr>
                ),
                additionalFields
              )}
            </tbody>
          </Table>
        </Modal>
        <button
          className="gv-link-button"
          onClick={e => {
            e.preventDefault()
            F.on(viewModal)()
          }}
        >
          Matched {_.size(additionalFields)} other field(s)
        </button>
      </Cell>
    )
  }
)

let HeaderCellDefault = _.flow(
  setDisplayName('HeaderCell'),
  observer
)(({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
))

let Header = _.flow(
  setDisplayName('Header'),
  observer,
  withTheme
)(
  ({
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
            <DropdownItem onClick={F.on(adding)}>
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
                if (!_.contains(field, includes))
                  mutate({ include: [...includes, field] })
                F.off(adding)()
              }}
            />
          </Modal>
        </Popover>
      </HeaderCell>
    )
  }
)

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = _.flow(
  setDisplayName('TableBody'),
  observer
)(({ node, visibleFields, fields, hiddenFields, schema, Row = 'tr' }) => (
  <tbody>
    {!!getResults(node).length &&
      _.map(
        x => (
          <Row
            key={x._id}
            record={getRecord(x)}
            {...{ fields, visibleFields, hiddenFields }}
          >
            {_.map(
              ({ field, display = x => x, Cell = 'td' }) => (
                <Cell key={field}>
                  {display(_.get(field, getRecord(x)), getRecord(x))}
                </Cell>
              ),
              visibleFields
            )}
            {node.showOtherMatches && (
              <HighlightedColumn
                {...{
                  node,
                  additionalFields: _.result('additionalFields.slice', x),
                  schema,
                }}
              />
            )}
          </Row>
        ),
        getResults(node)
      )}
  </tbody>
))

let Tr = props => (
  <tr
    {..._.omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props)}
  />
)

let ResultTable = ({
  fields,
  infer,
  path,
  criteria,
  node,
  tree,
  Row = Tr, // accept a custom Row component so we can do fancy expansion things
  mapNodeToProps = () => ({}),
  theme: { Table },
}) => {
  // From Theme/Components
  let mutate = tree.mutate(path)
  // NOTE infer + add columns does not work together (except for anything explicitly passed in)
  //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
  let schema = _.flow(
    _.merge(infer && inferSchema(node)),
    applyDefaults,
    _.values,
    _.orderBy('order', 'desc')
  )(fields)
  let includes = getIncludes(schema, node)
  let isIncluded = x => _.includes(x.field, includes)
  let visibleFields = _.flow(
    _.map(field => _.find({ field }, schema)),
    _.compact
  )(includes)
  let hiddenFields = _.reject(isIncluded, schema)

  let headerProps = {
    mapNodeToProps,
    fields,
    visibleFields,
    includes,
    addOptions: fieldsToOptions(hiddenFields),
    addFilter: field => tree.add(criteria, newNodeFromField({ field, fields })),
    tree,
    node,
    mutate,
    criteria,
  }

  return (
    <Table>
      <thead>
        <tr>
          {F.mapIndexed(
            x => (
              <Header key={x.field} field={x} {...headerProps} />
            ),
            visibleFields
          )}
          <HighlightedColumnHeader node={node} />
        </tr>
      </thead>
      <TableBody
        {...{
          node,
          fields,
          visibleFields,
          hiddenFields,
          schema,
          Row,
        }}
      />
    </Table>
  )
}

export default contexturify(ResultTable)
