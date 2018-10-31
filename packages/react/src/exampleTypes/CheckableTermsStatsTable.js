import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { Column } from '../layout/ExpandableTable'
import TermsStatsTable from './TermsStatsTable'

let CheckableTermsStatsTable = observer(
  ({
    criteria,
    children,
    Checkbox,
    checkable,
    getValue,
    selected,
    ...props
  }) => (
    <TermsStatsTable
      {...{
        ...props,
        children: criteria
          ? _.compact([
              checkable ? (
                <Column
                  label=""
                  expand={{
                    display: (x, y) => (
                      <Checkbox
                        {...F.domLens.checkboxValues(
                          _.iteratee(getValue)(y),
                          selected
                        )}
                      />
                    ),
                  }}
                />
              ) : (
                undefined
              ),
              ...children,
            ])
          : children,
      }}
    />
  )
)
CheckableTermsStatsTable.displayName = 'CheckableTermsStatsTable'

export default CheckableTermsStatsTable
