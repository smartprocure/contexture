import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

export let Column = _.identity
Column.displayName = 'Column'

let State = (stores, props) => {
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
  }
  return state
}

let ExpandedSection = observer(({ recordKey, columnCount, expanded }) =>
  _.flow(
    key => expanded.get(key),
    expandedRow =>
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
  )(recordKey)
)

let TableBody = observer(({ data, columns, recordKey, expanded, onClick }) => (
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
                    onClick: () => onClick(field, recordKey, x, i, details),
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
          <ExpandedSection
            recordKey={x[recordKey]}
            expanded={expanded}
            columnCount={columns.length}
          />
        </React.Fragment>
      ),
      data
    )}
  </tbody>
))

let ExpandableTable = inject(State)(
  observer(
    ({ data, columns, recordKey = 'key', expanded, onClick, ...props }) => (
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
        <TableBody
          columns={columns}
          data={data}
          recordKey={recordKey}
          expanded={expanded}
          onClick={onClick}
        />
      </table>
    )
  )
)

ExpandableTable.displayName = 'ExpandableTable'

export default ExpandableTable
