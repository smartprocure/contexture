import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import F from 'futil-js'

// Extends ResultTable with a checkbox column
// Writes to a lens called `selected`, using getValue to map the selected record to a value.
// getValues uses _.iteratee, so it defaults to identity and supports things like strings to get props
let CheckableResultTable = observer(
  ({ fields, selected, getValue, Checkbox, ResultTable, ...props }) => (
    <ResultTable
      fields={{
        _checkbox: {
          label: <Checkbox />,
          display: (x, y) => (
            <Checkbox {...F.domLens.checkboxValues(_.iteratee(getValue)(y), selected)} />
          ),
        },
        ...fields,
      }}
      {...props}
    />
  )
)
CheckableResultTable.displayName = 'CheckableResultTable'

export default CheckableResultTable
