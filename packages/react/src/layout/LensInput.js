import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import F from 'futil-js'
import { withTheme } from '../utils/theme'

let LensInput = ({ lens, theme, ...props }) => (
  <theme.Input {...F.domLens.value(lens)} {...props} />
)

export default _.flow(
  observer,
  withTheme
)(LensInput)
