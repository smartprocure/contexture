import React from 'react'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import styles from '../../styles'
import { oppositeJoin } from '../../utils/search'
import AddPreview from './AddPreview'

let Indentable = ({ children, indent, parent }) => (
  <div style={{ ...styles.dFlex, ...styles.w100 }}>
    {F.view(indent) && (
      <div
        style={{
          ...styles.indent,
          ...styles.bgPreview(oppositeJoin(parent)),
        }}
      />
    )}
    <div style={styles.w100}>
      {children}
      {F.view(indent) && <AddPreview join={oppositeJoin(parent)} />}
    </div>
  </div>
)

export default observer(Indentable)
