import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'

let Dynamic = ({ component: C = null, defaultProps, ...props }) =>
  C && (
    <C
      {..._.flow(
        F.compactObject,
        _.merge(defaultProps)
      )(props)}
    />
  )

export default observer(Dynamic)
