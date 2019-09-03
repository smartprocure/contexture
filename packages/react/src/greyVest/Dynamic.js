import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'

let Dynamic = ({ component: C = null, defaultProps, ...props }) =>
  C && (
    <C
      {..._.flow(
        _.pickBy(_.identity),
        _.merge(defaultProps)
      )(props)}
    />
  )

export default observer(Dynamic)
