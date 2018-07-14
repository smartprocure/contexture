import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'
import Popover from '../layout/Popover'
import { withStateLens } from '../utils/mobx-react-utils'
import { fieldsToOptions } from '../FilterAdder'

// For futil?
let onlyWhen = f => F.unless(f, () => {})
let FlattenTreeLeaves = Tree => _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
let PlainObjectTree = F.tree(onlyWhen(_.isPlainObject))
let flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree))

let getRecord = F.getOrReturn('_source')
let getResults = _.get('context.response.results')
let applyDefaults = F.mapValuesIndexed((val, field) =>
  _.defaults(
    {
      field,
      label: F.autoLabel(field),
      order: 0,
      display: x => F.when(_.get('push'), _.join(', '))(x)
    },
    val
  )
)
let inferSchema = _.flow(
  getResults,
  _.head,
  getRecord,
  flattenPlainObject
)
let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let menuIconStyle = { display: 'inline-block', width: '1em', textAlign: 'center' }
let popoverStyle = { textAlign: 'left', padding: '5px', fontWeight: 'normal', cursor: 'pointer' }
let Header = withStateLens({ popover: false, adding: false })(
  observer(({
    popover,
    field: { field, label },
    mutate,
    schema,
    node,
    adding,
    Modal,
    FieldPicker,
    includes,
    addOptions
  }) => (
    <th style={{ cursor: 'pointer' }}>
      <a onClick={F.flip(popover)}>
        {label}{' '}
        {field === node.sortField && (node.sortDir === 'asc' ? '▲' : '▼')}
      </a>
      <Popover isOpen={popover}>
        <div style={popoverStyle}>
          <div onClick={() => mutate({ sortField: field, sortDir: 'asc' })}>
            <span style={menuIconStyle}>▲</span> Sort Ascending
          </div>
          <div onClick={() => mutate({ sortField: field, sortDir: 'desc' })}>
            <span style={menuIconStyle}>▼</span> Sort Descending
          </div>
          <div
            onClick={() => mutate({ include: _.without([field], includes) })}
          >
            <span style={menuIconStyle}>x</span> Remove Column
          </div>
          {
            Modal && FieldPicker && !!addOptions.length &&
            <div onClick={F.on(adding)}>
              <span style={menuIconStyle}>+</span> Add Column
            </div>
          }
        </div>
        {Modal && FieldPicker && <Modal isOpen={adding}>
          <FieldPicker            
            options={addOptions}
            onChange={field =>{
              if (!_.contains(field, includes))
                mutate({ include: [...includes, field] })
              F.off(adding)()
            }}
          />
        </Modal>}
      </Popover>
    </th>
  ))
)
Header.displayName = 'Header'

let ResultTable = InjectTreeNode(
  observer(({ node, fields, infer, tree, path, Table = 'table', Modal, FieldPicker }) => {
    let mutate = tree.mutate(path)
    // NOTE infer + add columns does not work together (except for anything explicitly passed in)
    //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
    let schema = _.flow(
      _.merge(infer && inferSchema(node)),
      applyDefaults,
      _.values,
      _.orderBy('order', 'desc')
    )(fields)
    let isIncluded = x => _.isEmpty(node.include) || _.includes(x.field, node.include)
    let visibleFields = _.filter(isIncluded, schema)
    let hiddenFields = _.reject(isIncluded, schema)
    let headerProps = {
      mutate,
      schema,
      node,
      Modal,
      FieldPicker,
      includes: getIncludes(schema, node),
      addOptions: fieldsToOptions(hiddenFields)
    }
    
    if (!getResults(node).length) return null
    return (
      <Table>
        <thead>
          <tr>
            {_.map(
              x => (<Header key={x.field} field={x} {...headerProps} />),
              visibleFields
            )}
          </tr>
        </thead>
        <tbody>
          {_.map(
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
      </Table>
    )
  })
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
