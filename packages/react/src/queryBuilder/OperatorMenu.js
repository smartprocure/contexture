import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'
import F from 'futil'
import styles from '../styles/index.js'
import { oppositeJoin, indent } from '../utils/search.js'

let OperatorMenu = ({ node, hover, tree, parent, child, theme }) => {
  let { Button, ButtonGroup } = theme
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
      }}
    >
      <ButtonGroup style={{ gap: '8px' }}>
        {_.map(
          (join) =>
            node.join !== join && (
              <Button
                key={join}
                {...F.domLens.hover((x) => F.set(x && join, hover.join))}
                style={{
                  ...styles.bgJoin(join),
                  ...styles.buttonStyleReset,
                }}
                onClick={() => tree.mutate(node.path, { join })}
              >
                To {join.toUpperCase()}
              </Button>
            ),
          ['and', 'or', 'not']
        )}
      </ButtonGroup>
      <Button
        style={{
          ...styles.bgJoin(oppositeJoin((parent || node).join)),
          ...styles.buttonStyleReset,
        }}
        {...F.domLens.hover(hover.wrap)}
        onClick={() => {
          indent(tree, node, child)
          F.off(hover.wrap)()
        }}
      >
        Wrap in {oppositeJoin((parent || node).join).toUpperCase()}
      </Button>
      <Button
        {...F.domLens.hover(hover.remove)}
        onClick={() => tree.remove(node.path)}
        style={styles.buttonStyleReset}
      >
        Remove
      </Button>
    </div>
  )
}

export default observer(OperatorMenu)
