import React from 'react'
import { observer } from 'mobx-react'
import { loading } from '../styles/generic'

export default Component =>
  observer(props => (
    <div style={props.loading ? loading : {}}>
      <Component {...props} />
    </div>
  ))
