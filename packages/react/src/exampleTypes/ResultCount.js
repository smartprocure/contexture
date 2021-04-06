import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { withNode } from '../utils/hoc'
import { toNumber } from '../utils/format'
import { withTheme } from '../utils/theme'
import { StripedLoader } from '../greyVest'

let ResultCount = ({
  node = {},
  display = toNumber,
  noResults = 'No Results',
  theme: { Loader = StripedLoader },
}) => {
  let count = F.cascade(
    [
      'context.response.results.length',
      'context.results.length',
      'context.result',
      'context.value',
    ],
    node
  )
  let totalRecords = count
    ? F.cascade(
        [
          'context.response.totalRecords',
          'context.totalRecords',
          'context.result',
          'context.value',
        ],
        node
      )
    : 0
  return count
    ? display(totalRecords)
    : node.updating
      ? (
        <div style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          margin: '0 .1rem'
        }}>
          <Loader
            loading
            style={{ height: '1rem', width: '1.5rem', minHeight: 'auto' }}
          />
        </div>
      )
      : noResults
}

export default _.flow(observer, withNode, withTheme)(ResultCount)
