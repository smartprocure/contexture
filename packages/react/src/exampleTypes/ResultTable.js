import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'
import { Popover, Dynamic } from '../layout'
import { withStateLens } from '../utils/mobx-react-utils'
import { fieldsToOptions } from '../FilterAdder'
import { loading } from '../styles/generic'
import DefaultIcon from '../DefaultIcon'
import {
  applyDefaults,
  getRecord,
  getResults,
  inferSchema,
} from '../utils/schema'

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

let HighlightedColumnHeader = observer(
  ({
    node,
    Cell = 'th',
    results = _.result('slice', getResults(node)),
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
HighlightedColumnHeader.displayName = 'HighlightedColumnHeader'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

let HighlightedColumn = withStateLens({ viewModal: false })(
  observer(
    ({
      node,
      results = _.result('slice', getResults(node)),
      additionalFields = _.result('0.additionalFields.slice', results),
      Cell = 'td',
      Table = 'table',
      Modal = null,
      viewModal,
      schema,
    }) =>
      _.isEmpty(additionalFields) ? (
        <Cell key="additionalFields" />
      ) : (
        <Cell key="additionalFields">
          {Modal && (
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
          )}
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
  )
)
HighlightedColumn.displayName = 'HighlightedColumn'

let HeaderCellDefault = observer(({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
))
HeaderCellDefault.displayName = 'HeaderCellDefault'

let Header = withStateLens({ popover: false, adding: false, filtering: false })(
  observer(({ // Local State
    popover, adding, filtering, Modal, FieldPicker, ListGroupItem: Item, typeComponents, HeaderCell = HeaderCellDefault, field: fieldSchema, includes, addOptions, addFilter, tree, node, mutate, criteria, mapNodeToProps, fields, visibleFields, Icon }) => {
    // Components (providerable?) // Contextual
    let {
      disableFilter,
      disableSort,
      field,
      label,
      hideMenu,
      typeDefault,
    } = fieldSchema
    HeaderCell = fieldSchema.HeaderCell || HeaderCell
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
            <Item
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'asc' })
              }}
            >
              <Icon icon="SortAscending" />
              Sort Ascending
            </Item>
          )}
          {!disableSort && (
            <Item
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'desc' })
              }}
            >
              <Icon icon="SortDescending" />
              Sort Descending
            </Item>
          )}
          <Item
            onClick={() =>
              moveColumn(mutate, i => i - 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveLeft" />
            Move Left
          </Item>
          <Item
            onClick={() =>
              moveColumn(mutate, i => i + 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveRight" />
            Move Right
          </Item>
          <Item
            onClick={() => mutate({ include: _.without([field], includes) })}
          >
            <Icon icon="RemoveColumn" />
            Remove Column
          </Item>
          {Modal &&
            FieldPicker &&
            !!addOptions.length && (
              <Item onClick={F.on(adding)}>
                <Icon icon="AddColumn" />
                Add Column
              </Item>
            )}
          {criteria &&
            (typeDefault || filterNode) &&
            !disableFilter && (
              <div>
                <Item onClick={filter}>
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
                </Item>
                {F.view(filtering) &&
                  filterNode &&
                  !filterNode.paused && (
                    <Dynamic
                      component={typeComponents[filterNode.type]}
                      path={_.toArray(filterNode.path)}
                      {...mapNodeToProps(filterNode, fields, typeComponents)}
                    />
                  )}
              </div>
            )}
          {Modal &&
            FieldPicker && (
              <Modal isOpen={adding}>
                <FieldPicker
                  options={addOptions}
                  onChange={field => {
                    if (!_.contains(field, includes))
                      mutate({ include: [...includes, field] })
                    F.off(adding)()
                  }}
                />
              </Modal>
            )}
        </Popover>
      </HeaderCell>
    )
  })
)
Header.displayName = 'Header'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = observer(
  ({ node, visibleFields, Modal, Table, Row, schema }) => (
    <tbody style={node.markedForUpdate || node.updating ? loading : {}}>
      {!!getResults(node).length &&
        _.map(
          x => (
            <Row key={x._id}>
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
                    Modal,
                    Table,
                    schema,
                  }}
                />
              )}
            </Row>
          ),
          getResults(node)
        )}
    </tbody>
  )
)
TableBody.displayName = 'TableBody'

let ResultTable = InjectTreeNode(
  observer(({ // Props
    fields, infer, path, criteria, node, tree, Table = 'table', HeaderCell, Modal, ListGroupItem, FieldPicker, typeComponents, mapNodeToProps = () => ({}), Icon = DefaultIcon, Row = 'tr' }) => {
    // From Provider // Theme/Components
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
      Modal,
      FieldPicker,
      ListGroupItem,
      typeComponents,
      HeaderCell,
      Icon,
      mapNodeToProps,
      fields,
      visibleFields,
      includes,
      addOptions: fieldsToOptions(hiddenFields),
      addFilter: field =>
        tree.add(criteria, {
          key: _.uniqueId('add'),
          field,
          type: _.find({ field }, schema).typeDefault,
        }),
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
          Row={Row}
          node={node}
          visibleFields={visibleFields}
          Modal={Modal}
          Table={Table}
          schema={schema}
        />
      </Table>
    )
  }),
  { loadingAware: true }
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
