import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

let ExpandableTable = inject(() => {
  let state = observable({
    expandedRows: [],
  })

  return _.extend(state, {
    onClick(field, keyField, record, index, details) {
      let key = record[keyField]
      let indexedField = `${field}${index}`
      let expandedRow = state.expandedRows.find(row => row.key === key)
      if (!expandedRow) {
        state.expandedRows.push({
          key,
          record,
          field,
          indexedField,
          details,
        })
      } else if (expandedRow.indexedField !== indexedField) {
        expandedRow.field = field
        expandedRow.indexedField = indexedField
        expandedRow.details = details
      } else {
        state.expandedRows.remove(expandedRow)
      }
    },
  })
})(
  observer(
    ({ data, columns, recordKey = 'key', expandedRows, onClick, ...props }) => (
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
                          onClick: () =>
                            onClick(field, recordKey, x, i, details),
                        }}
                      >
                        {_.getOr(
                          display,
                          `${
                            expandedRows.find(
                              row =>
                                row.key === x[recordKey] &&
                                row.indexedField === `${field}${i}`
                            )
                              ? 'collapse'
                              : 'expand'
                          }.display`,
                          details
                        )(_.get(field, x), x)}
                      </td>
                    ),
                    columns
                  )}
                </tr>
                {/* See if there is a details component to render for the column value when row expanded */}
                {_.flow(
                  key => expandedRows.find(row => row.key === key),
                  expandedRow =>
                    _.get('details.Component', expandedRow) && (
                      <tr>
                        <td colSpan={columns.length}>
                          {expandedRow.details.Component(
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
    )
  )
)

ExpandableTable.displayName = 'ExpandableTable'

export default ExpandableTable
