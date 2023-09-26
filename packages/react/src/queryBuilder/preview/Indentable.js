import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import styles from '../../styles/index.js'
import { oppositeJoin } from '../../utils/search.js'
import AddPreview from './AddPreview.js'

let Indentable = ({ children, indent, parent }) => (
  <div style={{ display: 'flex', width: '100%' }}>
    {F.view(indent) && (
      <div
        style={{
          marginBottom: `${styles.ruleGutter}px`,
          borderRadius: 5,
          zIndex: 1,
          minWidth: `${styles.operatorWidth}px`,
          marginRight: `${styles.ruleGutter}px`,
          borderBottomRightRadius: 0,
          ...styles.bgPreview(oppositeJoin(parent)),
        }}
      />
    )}
    <div style={{ width: '100%' }}>
      {children}
      {F.view(indent) && <AddPreview join={oppositeJoin(parent)} />}
    </div>
  </div>
)

export default observer(Indentable)
