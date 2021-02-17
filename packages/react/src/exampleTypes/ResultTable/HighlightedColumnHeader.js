import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema'
import { withTheme } from '../../utils/theme'

let HighlightedColumnHeader = ({
  node,
  results = _.result('slice', getResults(node)),
  theme: { Th = 'th' },
  Cell = Th,
  hasAdditionalFields = !_.flow(
    _.map('additionalFields'),
    _.compact,
    _.isEmpty
  )(results),
}) =>
  hasAdditionalFields && node.showOtherMatches ? (
    <Cell key="additionalFields">Other Matches</Cell>
  ) : null

export default _.flow(observer, withTheme)(HighlightedColumnHeader)
