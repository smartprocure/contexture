import React from 'react'
import { Component } from '../../utils/mobx-react-utils'
import styles from '../../styles'

let AddPreview = ({ join, style, onClick }) => (
  <div style={{ background: styles.background }} onClick={onClick}>
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

export default Component(AddPreview)
