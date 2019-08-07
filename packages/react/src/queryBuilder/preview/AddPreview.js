import React from 'react'
import { observer } from 'mobx-react'
import styles from '../../styles'

let AddPreview = ({ join, style, onClick }) => (
  <div style={{ background: styles.background }} onClick={() => onClick(join)}>
    <div
      style={{
        ...styles.indentPreview,
        ...styles.bgPreview(join),
        ...style,
      }}
    >
      Click to add{' '}
      <b>
        <i>{join.toUpperCase()}</i>
      </b>
    </div>
  </div>
)

export default observer(AddPreview)
