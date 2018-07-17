import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'
import { Popover, Dynamic } from '../layout'
import { withStateLens } from '../utils/mobx-react-utils'
import { fieldsToOptions } from '../FilterAdder'
import { loading } from '../styles/generic'

// For futil?
let onlyWhen = f => F.unless(f, () => {})
let FlattenTreeLeaves = Tree => _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
let PlainObjectTree = F.tree(onlyWhen(_.isPlainObject))
let flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree))

let pushAt = _.curry((index, val, arr) => {
  let result = _.clone(arr)
  result.splice(index, 0, val)
  return result
})
let moveIndex = (from, to, arr) =>
  _.flow(_.pullAt(from), pushAt(to, arr[from]))(arr)

let getRecord = F.getOrReturn('_source')
let getResults = _.get('context.response.results')
let applyDefaults = F.mapValuesIndexed((val, field) => ({
  field,
  label: F.autoLabel(field),
  order: 0,
  display: x => F.when(_.get('push'), _.join(', '))(x),
  ...val,
}))
let inferSchema = _.flow(getResults, _.head, getRecord, flattenPlainObject)
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

let HeaderCellDefault = observer(({ activeFilter, style, ...props }) => (
  <a
    style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}
    {...props}
  />
))

let Header = withStateLens({ popover: false, adding: false, filtering: false })(
  observer(({ // Local State
    i, popover, adding, filtering,
    // Components (providerable?)
    Modal, FieldPicker, ListGroupItem: Item, typeComponents, HeaderCell = HeaderCellDefault,
    // Contextual
    field: { field, label }, includes, addOptions, addFilter, tree, node, mutate, criteria }) => {
    let filterNode =
      criteria && _.find({ field }, tree.getNode(criteria).children)
    let filter = () => {
      if (!filterNode) addFilter(field)
      F.flip(filtering)()
    }
    return (
      <th style={{ cursor: 'pointer' }}>
        <HeaderCell
          onClick={F.flip(popover)}
          activeFilter={_.get('hasValue', filterNode)}
        >
          {label}{' '}
          {field === node.sortField && (node.sortDir === 'asc' ? '▲' : '▼')}
        </HeaderCell>
        <Popover isOpen={popover} style={popoverStyle}>
          <Item onClick={() => mutate({ sortField: field, sortDir: 'asc' })}>
            <Icon icon="▲" />
            Sort Ascending
          </Item>
          <Item onClick={() => mutate({ sortField: field, sortDir: 'desc' })}>
            <Icon icon="▼" />
            Sort Descending
          </Item>
          <Item
            onClick={() =>
              mutate({ include: moveIndex(i, i - 1, [...includes]) })
            }
          >
            <Icon icon="←" />
            Move Left
          </Item>
          <Item
            onClick={() =>
              mutate({ include: moveIndex(i, i + 1, [...includes]) })
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
          {criteria && (
            <div>
              <Item onClick={filter}>
                <Icon
                  icon={filterNode ? (F.view(filtering) ? 'V' : '>') : '+'}
                />
                Filter
              </Item>
              {F.view(filtering) &&
                filterNode && (
                  <Dynamic
                    component={typeComponents[filterNode.type]}
                    path={[...filterNode.path]}
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
      </th>
    )
  })
)
Header.displayName = 'Header'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = observer(({ node, visibleFields }) => (
  <tbody style={node.markedForUpdate || node.updating ? loading : {}}>
    {!!getResults(node).length &&
      _.map(
        x => (
          <tr key={x._id}>
            {_.map(
              ({ field, display = x => x, Cell = 'td' }) => (
                <Cell key={field}>
                  {display(getRecord(x)[field], getRecord(x))}
                </Cell>
              ),
              visibleFields
            )}
          </tr>
        ),
        getResults(node)
      )}
  </tbody>
))

let ResultTable = InjectTreeNode(
  observer(({ // Props
    fields, infer, path, criteria,
    // From Provider
    node, tree,
    // Theme/Components
    Table = 'table', HeaderCell, Modal, ListGroupItem, FieldPicker, typeComponents }) => {
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
    let visibleFields = _.map(field => _.find({ field }, schema), includes)
    let hiddenFields = _.reject(isIncluded, schema)

    let headerProps = {
      Modal,
      FieldPicker,
      ListGroupItem,
      typeComponents,
      HeaderCell,

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
          </tr>
        </thead>
        <TableBody node={node} visibleFields={visibleFields} />
      </Table>
    )
  }),
  { loadingAware: true }
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
