import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

export let Column = _.identity
Column.displayName = 'Column'

let ExpandedSection = observer(
  ({ columnCount, expandedRow }) =>
    _.getOr(null, 'details.Component', expandedRow) && (
      <tr align="center">
        <td colSpan={columnCount}>
          {expandedRow.details.Component(
            _.get(expandedRow.field, expandedRow.record),
            expandedRow.record
          )}
        </td>
      </tr>
    )
)

let TableBodyState = () => {
  let state = {
    expanded: observable(new Map()),
    onClick(field, keyField, record, index, details) {
      let key = record[keyField]
      let indexedField = `${field}${index}`

      if (_.get('indexedField', state.expanded.get(key)) !== indexedField) {
        state.expanded.set(key, {
          key,
          record,
          field,
          indexedField,
          details,
        })
      } else {
        state.expanded.delete(key)
      }
    },
  }

  return state
}

let TableBody = inject(TableBodyState)(
  observer(({ data, columns, recordKey, expanded, onClick }) => (
    <tbody>
      {_.map(
        x => (
          <React.Fragment key={x[recordKey]}>
            <tr
              {...x.rowAttrs}
              key={x[recordKey]}
              className={
                _.getOr('', 'rowAttrs.className', x) +
                (expanded.has(x[recordKey]) ? 'expanded' : '')
              }
            >
              {F.mapIndexed(
                ({ field, display = x => x, details = {} }, i) => (
                  <td
                    key={`${field}${i}`}
                    {...!_.isEmpty(details) && {
                      style: {
                        cursor: !_.isEmpty(details) ? 'pointer' : 'auto',
                      },
                      onClick: () =>
                        onClick(field, recordKey, x, i, details, expanded),
                    }}
                  >
                    {_.getOr(
                      display,
                      `${
                        _.isEqual(
                          _.get('indexedField', expanded.get(x[recordKey])),
                          `${field}${i}`
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
            {expanded.has(x[recordKey]) && (
              <ExpandedSection
                expandedRow={expanded.get(x[recordKey])}
                columnCount={columns.length}
              />
            )}
          </React.Fragment>
        ),
        data
      )}
    </tbody>
  ))
)

let TableState = (stores, props) => ({
  columns: _.map(
    ({ props }) => ({
      ..._.pick(['field', 'label', 'display'], props),
      details: F.compactObject({
        ..._.pick(['expand', 'collapse'], props),
        Component: props.children,
      }),
    }),
    _.castArray(props.children)
  ),
})

let ExpandableTable = inject(TableState)(
  observer(({ data, columns, recordKey = 'key', ...props }) => (
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
      <TableBody columns={columns} data={data} recordKey={recordKey} />
    </table>
  ))
)

ExpandableTable.displayName = 'ExpandableTable'

export default ExpandableTable
