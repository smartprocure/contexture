import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { Column } from '../layout/ExpandableTable'
import TermsStatsTable from './TermsStatsTable'

let CheckableTermsStatsTable = observer(
  ({ children, Checkbox, getValue, selected, ...props }) => (
    <TermsStatsTable
      {...{
        ...props,
        children: [
          <Column
            label=""
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
)
CheckableTermsStatsTable.displayName = 'CheckableTermsStatsTable'

export default CheckableTermsStatsTable
