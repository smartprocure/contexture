import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import InjectTreeNode from '../utils/injectTreeNode'
import Popover from '../layout/Popover'
import { withStateLens } from '../utils/mobx-react-utils'

let getRecord = x => _.get('_source', x) || x
let getResults = _.get('context.response.results')
let buildSchema = F.mapValuesIndexed((val, field) => ({
  field,
  label: F.autoLabel(field),
  order: 0,
  display: val.push && _.join(', '),
}))
let inferSchema = _.flow(getResults, _.get('0'), getRecord, buildSchema)
let getIncludes = (node, schema) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let Header = withStateLens({ popover: false })(
  observer(({ popover, field: { field, label }, mutate, schema, node }) => (
    <th>
      <a onClick={F.flip(popover)}>
        {label}{' '}
        {field == node.sortField && (node.sortDir === 'asc' ? '^' : 'v')}
      </a>
      <Popover isOpen={popover}>
        <div style={{ textAlign: 'left' }}>
          <div>
            <a onClick={() => mutate({ sortField: field, sortDir: 'asc' })}>
              ^ Sort Ascending
            </a>
          </div>
          <div>
            <a onClick={() => mutate({ sortField: field, sortDir: 'desc' })}>
              v Sort Descending
            </a>
          </div>
          <div>
            <a
              onClick={() =>
                mutate({
                  include: _.without([field], getIncludes(schema, node)),
                })
              }
            >
              x Remove Column
            </a>
          </div>
        </div>
      </Popover>
    </th>
  ))
)

export default InjectTreeNode(
  observer(({ node, fields, infer, tree, path, Table = 'table' }) => {
    let mutate = tree.mutate(path)
    let schema = _.flow(
      _.merge(infer && inferSchema(node)),
      _.values,
      _.orderBy('order', 'desc'),
      _.filter(
        x => _.isEmpty(node.include) || _.includes(x.field, node.include)
      )
    )(fields)
    return (
      !!getResults(node).length && (
        <Table>
          <thead>
            <tr>
              {_.map(
                x => (
                  <Header
                    key={x.field}
                    field={x}
                    {...{ mutate, schema, node }}
                  />
                ),
                schema
              )}
            </tr>
          </thead>
          <tbody>
            {_.map(
              x => (
                <tr key={x._id}>
                  {_.map(
                    ({ field, display, Cell = 'td' }) => (
                      <Cell key={field}>
                        {(display || (x => x))(
                          getRecord(x)[field],
                          getRecord(x)
                        )}
                      </Cell>
                    ),
                    schema
                  )}
                </tr>
              ),
              getResults(node)
            )}
          </tbody>
        </Table>
      )
    )
  })
)
