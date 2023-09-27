import React from 'react'
import _ from 'lodash/fp.js'
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
        height: styles.operatorHeight / 2,
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

let OperatorTag = observer(({ node, hover, theme }) => (
  <theme.Button
    style={{
      width: `${styles.operatorWidth}px`,
      lineHeight: `${styles.operatorHeight}px`,
      ...styles.bgJoin(F.view(hover.join) || node),
      ...(F.view(hover.join) && { fontStyle: 'italic' }),
      // Reset button styles
      padding: 0,
      ...styles.buttonStyleReset,
    }}
  >
    {F.view(hover.join) || node.join}
  </theme.Button>
))

let Operator = ({ hover, node, child, parent, tree, index, theme, adding }) => {
  const isLast = index === _.size(_.toArray(node.children)) - 1
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
      <HorizontalLine {...{ node, child }} />
      {(!isLast || F.view(adding)) && <VerticalLine node={node} />}
    </div>
  )
}

export default observer(Operator)
