import _ from 'lodash/fp'
import F from 'futil'
import React from 'react'
import { Column } from '../greyVest/ExpandableTable'
import { contexturify } from '../utils/hoc'
import TermsStatsTable from './TermsStatsTable'

let CheckableTermsStatsTable = ({
  node,
  children,
  getValue,
  selected,
  theme: { Checkbox },
  ...props
}) => {
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
}

export default contexturify(CheckableTermsStatsTable)
