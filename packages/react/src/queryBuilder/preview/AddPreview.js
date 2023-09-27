import React from 'react'
import { observer } from 'mobx-react'
import styles from '../../styles/index.js'

let AddPreview = ({ join, onClick, theme, style }) => (
  <theme.Button
    onClick={() => onClick(join)}
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
  </theme.Button>
)

export default observer(AddPreview)
