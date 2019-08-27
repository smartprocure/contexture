import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { Column } from '../greyVest/ExpandableTable'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import TermsStatsTable from './TermsStatsTable'

let CheckableTermsStatsTable = _.flow(
  contexturify,
  withTheme
)(({ node, children, theme: { Checkbox }, getValue, selected, ...props }) => {
  let results = _.result('context.terms.slice', node)
  let allChecked = _.size(results) === _.size(F.view(selected))
  let checkAll = F.sets(
    allChecked ? [] : _.map(_.iteratee(getValue), results),
    selected
  )
  return (
    <TermsStatsTable
      {...{
        ...props,
        children: [
          <Column
            label={<Checkbox checked={allChecked} onChange={checkAll} />}
            display={(x, y) => (
              <Checkbox
                {...F.domLens.checkboxValues(_.iteratee(getValue)(y), selected)}
              />
            )}
          />,
          ...children,
        ],
      }}
    />
  )
})
CheckableTermsStatsTable.displayName = 'CheckableTermsStatsTable'

export default CheckableTermsStatsTable
