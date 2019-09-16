import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { contexturify, withTreeLens } from '../utils/hoc'
import { setDisplayName } from 'recompose'

let LensInput = ({ lens, theme: { TextInput }, ...props }) => (
  <TextInput {...F.domLens.value(lens)} {...props} />
)

let Text = _.flow(
  setDisplayName('Text'),
  contexturify,
  withTreeLens
)(LensInput)

export default Text
