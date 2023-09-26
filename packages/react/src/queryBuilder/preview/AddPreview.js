import React from 'react'
import { observer } from 'mobx-react'
import styles from '../../styles/index.js'

let AddPreview = ({ join, style, onClick }) => (
  <div style={{ background: styles.background }} onClick={() => onClick(join)}>
    <div
      style={{
        marginBottom: `${styles.ruleGutter}px`,
        borderRadius: 5,
        width: '100%',
        padding: '10px',
        lineHeight: '30px',
        borderLeft: 0,
        marginLeft: `-${styles.ruleGutter + 5}px`, //+5 arbitrarily aligns bg slashes
        paddingLeft: styles.ruleGutter * 2,
        ...styles.roundedLeft0,
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
