import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { contexturify, withTreeLens } from '../utils/hoc'
import { withTheme } from '../utils/theme'

let LensInput = ({ lens, theme, ...props }) => (
  <theme.Input {...F.domLens.value(lens)} {...props} />
)

let Text = _.flow(
  withTreeLens,
  contexturify,
  withTheme
)(LensInput)
Text.displayName = 'Text'

export default Text
