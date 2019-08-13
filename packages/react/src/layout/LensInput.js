import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import F from 'futil-js'
import { withTheme } from '../utils/theme'

let LensInput = ({ lens, theme: { Input = 'input' }, ...props }) => (
  <Input {...F.domLens.value(lens)} {...props} />
)

export default _.flow(
  observer,
  withTheme('LensInput')
)(LensInput)
