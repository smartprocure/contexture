import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import styles from '../styles/index.js'
import OperatorMenu from './OperatorMenu.js'
import { useFilterDropTarget } from './DragDrop/FilterDropTarget.js'

let HorizontalLine = observer(({ node, child }) => {
  const marginLeft = `${(styles.operatorWidth - styles.lineWidth) / 2}px`
  return (
    <div
      style={{
        width: child.children ? '100%' : `calc(100% - ${marginLeft})`,
        height: (styles.operatorHeight - 4) / 2,
        marginLeft,
        borderBottom: `solid ${styles.lineWidth}px black`,
        borderBottomColor: styles.joinColor(node.join),
      }}
    />
  )
})

let VerticalLine = observer(({ node }) => (
  <div
    style={{
      flex: 1,
      marginLeft: `${(styles.operatorWidth - styles.lineWidth) / 2}px`,
      borderLeft: `solid ${styles.lineWidth}px black`,
      borderLeftColor: styles.joinColor(node.join),
    }}
  />
))

let OperatorTag = observer(({ node, hover, theme, canDrop }) => (
  <theme.Button
    style={{
      padding: 0,
      color: 'white',
      fontWeight: 'bold',
      width: `${styles.operatorWidth}px`,
      lineHeight: `${styles.operatorHeight}px`,
      textTransform: 'none',
      letterSpacing: 'initial',
      ...(canDrop
        ? { background: 'transparent' }
        : styles.bgJoin(F.view(hover.join) || node)),
      ...(F.view(hover.join) && { fontStyle: 'italic' }),
    }}
  >
    {F.view(hover.join) || node.join}
  </theme.Button>
))

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
}) => {
  const [{ canDrop }, drop] = useFilterDropTarget({
    drop(source) {
      tree.move(source.node.path, {
        path: node.path,
        index: index + 1,
      })
    },
  })
  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: `${styles.operatorWidth + styles.ruleGutter}px`,
        ...(canDrop && styles.bgPreview(node)),
      }}
    >
      <HorizontalLine {...{ node, child }} />
      {(!isLast || F.view(adding)) && <VerticalLine node={node} />}
      {(index !== 0 || node.join === 'not') && (
        <div style={{ position: 'absolute' }}>
          <theme.Popover
            trigger={<OperatorTag {...{ node, hover, theme, canDrop }} />}
            style={{ marginTop: '10px' }}
          >
            <OperatorMenu {...{ node, hover, tree, parent, child, theme }} />
          </theme.Popover>
        </div>
      )}
    </div>
  )
}

export default observer(Operator)
