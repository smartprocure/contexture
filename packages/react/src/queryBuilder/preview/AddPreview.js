import React from 'react'
import { observer } from 'mobx-react'
import styles from '../../styles'

let AddPreview = observer(({ join, style, onClick }) => (
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
))
AddPreview.displayName = 'AddPreview'

export default AddPreview
