import React from 'react'
import { observer } from 'mobx-react'
import { bgStriped } from '../styles/generic'

export default Component => observer(
  props => 
    props.loading
      ? <div style={{ ...bgStriped, opacity: '0.5' }}>
          <Component {...props} />
        </div>
      : <Component {...props} />
)
