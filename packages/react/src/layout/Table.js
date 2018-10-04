import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

let Table = inject(() => ({
  state: observable({
    expandedRows: [],
  }),
}))(
  observer(({ data, columns, recordKey = 'key', state, ...props }) => (
    <table {...props.tableAttrs}>
      <thead>
        <tr>
          {F.mapIndexed(
            (c, i) => (
              <th key={`${c.field}${i}`}>
                {F.callOrReturn(_.getOr(F.autoLabel(c.field), 'label', c))}
              </th>
            ),
            columns
          )}
        </tr>
      </thead>
      <tbody>
        {_.map(
          x => (
            <React.Fragment key={x[recordKey]}>
              <tr {...x.rowAttrs} key={x[recordKey]}>
                {F.mapIndexed(
                  ({ field, display = x => x, details = {} }, i) => (
                    <td
                      key={`${field}${i}`}
                      {...!_.isEmpty(details) && {
                        style: {
                          cursor: !_.isEmpty(details) ? 'pointer' : 'auto',
                        },
                        onClick() {
                          let indexedField = `${field}${i}`
                          let expandedRow = state.expandedRows.find(
                            row => row.key === x[recordKey]
                          )
                          if (!expandedRow) {
                            state.expandedRows.push({
                              key: x[recordKey],
                              record: x,
                              field,
                              indexedField,
                              details,
                            })
                          } else if (
                            expandedRow.indexedField !== indexedField
                          ) {
                            expandedRow.field = field
                            expandedRow.indexedField = indexedField
                            expandedRow.details = details
                          } else {
                            state.expandedRows.remove(expandedRow)
                          }
                        },
                      }}
                    >
                      {_.getOr(
                        display,
                        `${
                          state.expandedRows.find(
                            row =>
                              row.key === x[recordKey] &&
                              row.indexedField === `${field}${i}`
                          )
                            ? 'collapse'
                            : 'expand'
                        }.display`,
                        details
                      )(_.get(field, x))}
                    </td>
                  ),
                  columns
                )}
              </tr>
              {/* See if there is a details component to render for the column value when row expanded */}
              {_.flow(
                key => state.expandedRows.find(row => row.key === key),
                expandedRow =>
                  _.get('details.component', expandedRow) && (
                    <tr>
                      <td colSpan={columns.length}>
                        {expandedRow.details.component(
                          _.get(expandedRow.field, expandedRow.record),
                          expandedRow.record
                        )}
                      </td>
                    </tr>
                  )
              )(x[recordKey])}
            </React.Fragment>
          ),
          data
        )}
      </tbody>
    </table>
  ))
)

Table.displayName = 'Table'

export default Table
