import _ from 'lodash/fp'
import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { withNode, withLoader, withTreeLens } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import { setDisplayName } from 'recompose'

let LensInput = ({ lens, theme: { TextInput }, ...props }) => (
  <TextInput {...F.domLens.value(lens)} {...props} />
)

let Text = _.flow(
  setDisplayName('Text'),
  observer,
  withTreeLens,
  withNode,
  withLoader,
  withTheme
)(LensInput)

export default Text
