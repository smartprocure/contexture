import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { getResults, getRecord } from '../utils/schema'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import ResultTable from './ResultTable'
import { selectedBinding } from './utils'
import { expandProp } from '../utils/react'

let Label = _.flow(
  setDisplayName('Label'),
  observer,
  withTheme
)(({ node, selected, getValue, theme: { Checkbox } }) => {
  let results = _.toArray(getResults(node))
  let allChecked = _.size(results) === _.size(F.view(selected))
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
let CheckableResultTable = ({
  node,
  fields,
  selectedValues,
  onChange,
  getValue,
  theme: { Checkbox },
  ...props
}) => (
  <ResultTable
    fields={{
      _checkbox: {
        hideMenu: true,
        label: () => (
          <Label
            {...{ node, selected: [selectedValues, onChange], getValue }}
          />
        ),
        display: (x, y) => (
          <Checkbox
            {...F.domLens.checkboxValues(_.iteratee(getValue)(y), [
              selectedValues,
              onChange,
            ])}
          />
        ),
      },
      ...fields,
    }}
    {...props}
  />
)

export default _.flow(
  expandProp('selected', selectedBinding),
  contexturify
)(CheckableResultTable)
