import React from 'react'
import * as F from 'futil-js'
import { Component } from '../../utils/mobx-react-utils'
import styles from '../../styles'
import { oppositeJoin } from '../../utils/search'
import AddPreview from './AddPreview'

let Indentable = ({ children, indent, tree }) => (
  <div style={{ ...styles.dFlex, ...styles.w100 }}>
    {F.view(indent) && (
      <div
        style={{
          ...styles.indent,
          ...styles.bgPreview(oppositeJoin(tree.join)),
        }}
      />
    )}
    <div style={styles.w100}>
      {children}
      {F.view(indent) && <AddPreview join={oppositeJoin(tree.join)} />}
    </div>
  </div>
)

export default Component(Indentable)
