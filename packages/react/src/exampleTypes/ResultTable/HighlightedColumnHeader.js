import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema.js'
import { withTheme } from '../../utils/theme.js'

let HighlightedColumnHeader = ({
  node,
  results = _.result('slice', getResults(node)),
  theme: { Th },
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
