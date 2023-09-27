import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import styles from '../../styles/index.js'
import { oppositeJoin } from '../../utils/search.js'
import AddPreview from './AddPreview.js'

let Indentable = ({ children, indent, parent, theme, isLeaf, style }) => (
  <div data-id="indentable" style={style}>
    <div style={{ display: 'flex' }}>
      {F.view(indent) && (
        <div
          style={{
            ...styles.indent,
            ...styles.bgPreview(oppositeJoin(parent)),
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <div
          style={
            F.view(indent)
              ? {
                  marginLeft: styles.ruleGutter,
                  marginBottom: isLeaf && styles.ruleGutter,
                }
              : {}
          }
        >
          {children}
        </div>
        {F.view(indent) && (
          <AddPreview
            theme={theme}
            join={oppositeJoin(parent)}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
        )}
      </div>
    </div>
  </div>
)

export default observer(Indentable)
