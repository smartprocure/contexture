import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema'

let HighlightedColumnHeader = ({
  node,
  results = _.result('slice', getResults(node)),
  Cell = 'th',
  hasAdditionalFields = !_.flow(
    _.map('additionalFields'),
    _.compact,
    _.isEmpty
  )(results),
}) =>
  hasAdditionalFields && node.showOtherMatches ? (
    <Cell key="additionalFields">Other Matches</Cell>
  ) : null

export default observer(HighlightedColumnHeader)
