import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { contexturify } from '../utils/hoc'
import { Dynamic } from '../greyVest'
import { useLens } from '../utils/react'
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
  observer,
  withTheme
)(
  ({
    node,
    theme: { TableHeaderCell },
    results = _.result('slice', getResults(node)),
    hasAdditionalFields = !_.flow(
      _.map('additionalFields'),
      _.compact,
      _.isEmpty
    )(results),
  }) =>
    hasAdditionalFields && node.showOtherMatches ? (
      <TableHeaderCell key="additionalFields">Other Matches</TableHeaderCell>
    ) : null
)
HighlightedColumnHeader.displayName = 'HighlightedColumnHeader'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

let HighlightedColumn = _.flow(
  observer,
  withTheme
)(
  ({
    node,
    results = _.result('slice', getResults(node)),
    additionalFields = _.result('0.additionalFields.slice', results),
    theme: { TableCell, Modal, Table },
    schema,
  }) => {
    let viewModal = useLens(false)
    return _.isEmpty(additionalFields) ? (
      <TableCell key="additionalFields" />
    ) : (
      <TableCell key="additionalFields">
        <Modal isOpen={viewModal}>
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
      </TableCell>
    )
  }
)
HighlightedColumn.displayName = 'HighlightedColumn'

let Header = _.flow(
  observer,
  withTheme
)(
  ({
    theme: {
      ListItem,
      Icon,
      Popover,
      Modal,
      Picker,
      TableHeaderCell,
      MissingTypeComponent,
    },
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
  }) => {
    let popover = useLens(false)
    let adding = useLens(false)
    let filtering = useLens(false)
    let {
      disableFilter,
      disableSort,
      field,
      label,
      hideMenu,
      typeDefault,
    } = fieldSchema
    TableHeaderCell = fieldSchema.HeaderCell || TableHeaderCell
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
      <TableHeaderCell
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
          isOpen={{
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
            <ListItem
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'asc' })
              }}
            >
              <Icon icon="SortAscending" />
              Sort Ascending
            </ListItem>
          )}
          {!disableSort && (
            <ListItem
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'desc' })
              }}
            >
              <Icon icon="SortDescending" />
              Sort Descending
            </ListItem>
          )}
          <ListItem
            onClick={() =>
              moveColumn(mutate, i => i - 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveLeft" />
            Move Left
          </ListItem>
          <ListItem
            onClick={() =>
              moveColumn(mutate, i => i + 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveRight" />
            Move Right
          </ListItem>
          <ListItem
            onClick={() => mutate({ include: _.without([field], includes) })}
          >
            <Icon icon="RemoveColumn" />
            Remove Column
          </ListItem>
          {!!addOptions.length && (
            <ListItem onClick={F.on(adding)}>
              <Icon icon="AddColumn" />
              Add Column
            </ListItem>
          )}
          {criteria && (typeDefault || filterNode) && !disableFilter && (
            <div>
              <ListItem onClick={filter}>
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
              </ListItem>
              {F.view(filtering) && filterNode && !filterNode.paused && (
                <Dynamic
                  component={MissingTypeComponent}
                  tree={tree}
                  path={_.toArray(filterNode.path)}
                  {...mapNodeToProps(filterNode, fields)}
                />
              )}
            </div>
          )}
          <Modal isOpen={adding}>
            <Picker
              options={addOptions}
              onChange={field => {
                if (!_.contains(field, includes))
                  mutate({ include: [...includes, field] })
                F.off(adding)()
              }}
            />
          </Modal>
        </Popover>
      </TableHeaderCell>
    )
  }
)
Header.displayName = 'Header'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = _.flow(
  observer,
  withTheme
)(({ node, visibleFields, fields, hiddenFields, theme, schema, Row }) => {
  let TableRow = Row || theme.TableRow
  return (
    <tbody>
      {!!getResults(node).length &&
        _.map(
          x => (
            <TableRow
              key={x._id}
              record={getRecord(x)}
              {...{ fields, visibleFields, hiddenFields }}
            >
              {_.map(
                ({ field, display = x => x, Cell = theme.TableCell }) => (
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
            </TableRow>
          ),
          getResults(node)
        )}
    </tbody>
  )
})
TableBody.displayName = 'TableBody'

let ResultTable = _.flow(
  contexturify,
  withTheme
)(
  ({
    fields,
    infer,
    path,
    criteria,
    node,
    tree,
    theme: { Table },
    Row, // accept a custom Row component so we can do fancy expansion things
    mapNodeToProps = () => ({}),
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
      addFilter: field =>
        tree.add(criteria, newNodeFromField({ field, fields })),
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
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
