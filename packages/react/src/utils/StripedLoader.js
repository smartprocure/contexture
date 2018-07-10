import React from 'react'
import { observer } from 'mobx-react'
import { bgStriped } from '../styles/generic'

export default Component =>
  observer(props => (
    <div style={props.loading ? {...bgStriped, opacity: '0.5'} : {}}>
      <Component {...props} />
    </div>
  ))
