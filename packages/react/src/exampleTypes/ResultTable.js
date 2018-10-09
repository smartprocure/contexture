import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'
import { Popover, Dynamic } from '../layout'
import { withStateLens } from '../utils/mobx-react-utils'
import { fieldsToOptions } from '../FilterAdder'
import { loading } from '../styles/generic'
import { applyDefaults } from '../utils/schema'
import { flattenPlainObject } from '../utils/futil'

let getRecord = F.when('_source', x => ({
  _id: x._id,
  ...x._source,
}))

let getResults = _.get('context.response.results')
let inferSchema = _.flow(
  getResults,
  _.head,
  getRecord,
  flattenPlainObject
)
let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let menuIconStyle = {
  display: 'inline-block',
  width: '1em',
  textAlign: 'center',
  marginRight: '5px',
}
let Icon = ({ icon }) => <span style={menuIconStyle}>{icon}</span>

let popoverStyle = {
  textAlign: 'left',
  padding: '10px',
  fontWeight: 'normal',
  cursor: 'pointer',
  userSelect: 'none',
}

let HighlightedColumnHeader = observer(
  ({
    node,
    results = _.result('slice', getResults(node)),
    additionalFields = _.result('0.additionalFields.slice', results),
    Cell = 'th',
  }) =>
    !_.isEmpty(additionalFields) ? (
      <Cell key="additionalFields">Other Matches</Cell>
    ) : null
)
HighlightedColumnHeader.displayName = 'HighlightedColumnHeader'

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
    }) =>
      !_.isEmpty(additionalFields) ? (
        <Cell key="additionalFields">
          {Modal && (
            <Modal isOpen={viewModal}>
              <h3>Other Matching Fields</h3>
              <Table>
                <tbody>
                  {_.map(
                    ({ label, value }) => (
                      <tr>
                        <td key={label}>{label}</td>
                        <td dangerouslySetInnerHTML={{ __html: value }} />
                      </tr>
                    ),
                    additionalFields
                  )}
                </tbody>
              </Table>
            </Modal>
          )}
          <div onClick={F.on(viewModal)}>
            This search also matched on the fields:{' '}
            {_.flow(
              _.map(({ label }) => <b>{label}</b>),
              F.intersperse(F.differentLast(() => ', ', () => ' and '))
            )(additionalFields)}
            .<br />
            <i>Click here to expand.</i>
          </div>
        </Cell>
      ) : null
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
    i, popover, adding, filtering, Modal, FieldPicker, ListGroupItem: Item, typeComponents, HeaderCell = HeaderCellDefault, field: fieldSchema, includes, addOptions, addFilter, tree, node, mutate, criteria, mapNodeToProps, fields }) => {
    // Components (providerable?) // Contextual
    let { disableFilter, disableSort, field, label, typeDefault } = fieldSchema
    HeaderCell = fieldSchema.HeaderCell || HeaderCell
    let filterNode =
      criteria && _.find({ field }, tree.getNode(criteria).children)
    let filter = () => {
      if (!filterNode) addFilter(field)
      F.flip(filtering)()
    }
    return (
      <HeaderCell
        style={{ cursor: 'pointer' }}
        activeFilter={_.get('hasValue', filterNode)}
      >
        <span onClick={F.flip(popover)}>
          {label}{' '}
          {field === node.sortField && (node.sortDir === 'asc' ? '▲' : '▼')}
        </span>
        <Popover isOpen={popover} style={popoverStyle}>
          {!disableSort && (
            <Item
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'asc' })
              }}
            >
              <Icon icon="▲" />
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
              <Icon icon="▼" />
              Sort Descending
            </Item>
          )}
          <Item
            onClick={() =>
              mutate({ include: F.moveIndex(i, i - 1, [...includes]) })
            }
          >
            <Icon icon="←" />
            Move Left
          </Item>
          <Item
            onClick={() =>
              mutate({ include: F.moveIndex(i, i + 1, [...includes]) })
            }
          >
            <Icon icon="→" />
            Move Right
          </Item>
          <Item
            onClick={() => mutate({ include: _.without([field], includes) })}
          >
            <Icon icon="x" />
            Remove Column
          </Item>
          {Modal &&
            FieldPicker &&
            !!addOptions.length && (
              <Item onClick={F.on(adding)}>
                <Icon icon="+" />
                Add Column
              </Item>
            )}
          {criteria &&
            (typeDefault || filterNode) &&
            !disableFilter && (
              <div>
                <Item onClick={filter}>
                  <Icon
                    icon={filterNode ? (F.view(filtering) ? 'V' : '>') : '+'}
                  />
                  Filter
                </Item>
                {F.view(filtering) &&
                  filterNode && !filterNode.paused && (
                    <Dynamic
                      component={typeComponents[filterNode.type]}
                      path={[...filterNode.path]}
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
let TableBody = observer(({ node, visibleFields, Modal, Table }) => (
  <tbody style={node.markedForUpdate || node.updating ? loading : {}}>
    {!!getResults(node).length &&
      _.map(
        x => (
          <tr key={x._id}>
            {_.map(
              ({ field, display = x => x, Cell = 'td' }) => (
                <Cell key={field}>
                  {display(_.get(field, getRecord(x)), getRecord(x))}
                </Cell>
              ),
              visibleFields
            )}
            <HighlightedColumn
              {...{
                node,
                additionalFields: _.result('additionalFields.slice', x),
                Modal,
                Table,
              }}
            />
          </tr>
        ),
        getResults(node)
      )}
  </tbody>
))
TableBody.displayName = 'TableBody'

let ResultTable = InjectTreeNode(
  observer(({ // Props
    fields, infer, path, criteria, node, tree, Table = 'table', HeaderCell, Modal, ListGroupItem, FieldPicker, typeComponents, mapNodeToProps }) => {
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
      mapNodeToProps,
      fields,

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
              (x, i) => (
                <Header key={x.field} field={x} i={i} {...headerProps} />
              ),
              visibleFields
            )}
            <HighlightedColumnHeader node={node} />
          </tr>
        </thead>
        <TableBody
          node={node}
          visibleFields={visibleFields}
          Modal={Modal}
          Table={Table}
        />
      </Table>
    )
  }),
  { loadingAware: true }
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
