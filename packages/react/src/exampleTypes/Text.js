import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { contexturify, withTreeLens } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import { setDisplayName } from 'recompose'

let LensInput = ({ lens, theme: { TextInput }, ...props }) => (
  <TextInput {...F.domLens.value(lens)} {...props} />
)

let Text = _.flow(
  setDisplayName('Text'),
  withTreeLens,
  contexturify,
  withTheme
)(LensInput)

export default Text
