import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import F from 'futil-js'
import { getResults, getRecord } from '../utils/schema'
import { length } from '../utils/futil'
import InjectTreeNode from '../utils/injectTreeNode'

let Label = observer(({ node, Checkbox, selected, getValue }) => {
  let results = getResults(node).slice()
  let allChecked = length(results) === length(F.view(selected))
  let checkAll = F.sets(
    allChecked
      ? []
      : _.map(
          _.flow(
            getRecord,
            _.iteratee(getValue)
          ),
          results
        ),
    selected
  )
  return <Checkbox checked={allChecked} onChange={checkAll} />
})

// Extends ResultTable with a checkbox column
// Writes to a lens called `selected`, using getValue to map the selected record to a value.
// getValues uses _.iteratee, so it defaults to identity and supports things like strings to get props
let CheckableResultTable = InjectTreeNode(
  observer(
    ({ node, fields, selected, getValue, Checkbox, ResultTable, ...props }) => (
      <ResultTable
        fields={{
          _checkbox: {
            hideMenu: true,
            label: () => <Label {...{ node, Checkbox, selected, getValue }} />,
            display: (x, y) => (
              <Checkbox
                {...F.domLens.checkboxValues(_.iteratee(getValue)(y), selected)}
              />
            ),
          },
          ...fields,
        }}
        {...props}
      />
    )
  )
)
CheckableResultTable.displayName = 'CheckableResultTable'

export default CheckableResultTable
