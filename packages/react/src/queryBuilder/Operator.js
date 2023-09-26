import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import styles from '../styles/index.js'
import OperatorMenu from './OperatorMenu.js'
import { OperatorMoveTarget } from './DragDrop/MoveTargets.js'

let HorizontalLine = ({ node, child }) => {
  const marginLeft = `${(styles.operatorWidth - styles.lineWidth) / 2}px`
  return (
    <div
      style={{
        width: child.children ? '100%' : `calc(100% - ${marginLeft})`,
        height: (styles.operatorHeight - 4) / 2,
        marginLeft,
        background: styles.background,
        borderBottom: `solid ${styles.lineWidth}px black`,
        borderBottomColor: styles.joinColor(node.join),
      }}
    />
  )
}

let VerticalLine = ({ node }) => (
  <div
    style={{
      flex: 1,
      marginLeft: `${(styles.operatorWidth - styles.lineWidth) / 2}px`,
      borderLeft: `solid ${styles.lineWidth}px black`,
      borderLeftColor: styles.joinColor(node.join),
    }}
  />
)

let OperatorTag = ({ node, hover, theme }) => (
  <theme.Button
    style={{
      padding: 0,
      color: 'white',
      fontWeight: 'bold',
      width: `${styles.operatorWidth}px`,
      lineHeight: `${styles.operatorHeight}px`,
      textTransform: 'none',
      letterSpacing: 'initial',
      ...styles.bgJoin(F.view(hover.join) || node),
      ...(F.view(hover.join) && { fontStyle: 'italic' }),
    }}
  >
    {F.view(hover.join) || node.join}
  </theme.Button>
)

let Operator = ({
  hover,
  node,
  child,
  parent,
  tree,
  index,
  isLast,
  theme,
  adding,
}) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: `${styles.operatorWidth + styles.ruleGutter}px`,
    }}
  >
    <HorizontalLine {...{ node, child }} />
    {(!isLast || F.view(adding)) && <VerticalLine node={node} />}
    {(index !== 0 || node.join === 'not') && (
      <div style={{ position: 'absolute' }}>
        <theme.Popover
          trigger={<OperatorTag {...{ node, hover, theme }} />}
          style={{ marginTop: '10px' }}
        >
          <OperatorMenu {...{ node, hover, tree, parent, child, theme }} />
        </theme.Popover>
      </div>
    )}
    <OperatorMoveTarget {...{ node, tree, index }} />
  </div>
)

export default observer(Operator)
