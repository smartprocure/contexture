import React from 'react'
import { useFilterDropTarget } from './FilterDropTarget.js'
import styles from '../../styles/index.js'

// Move
let FilterMoveDropTarget =
  (style) =>
  ({ node, tree, index }) => {
    const [{ canDrop, isOver }, drop] = useFilterDropTarget({
      drop(source) {
        tree.move(source.node.path, {
          path: node.path,
          index: index,
        })
      },
    })
    return canDrop ? (
      <div
        ref={drop}
        style={{
          ...styles.bgPreview(node),
          ...style({ isOver }),
        }}
      />
    ) : (
      <div />
    )
  }

export let OperatorMoveTarget = FilterMoveDropTarget(() => ({
  width: `${styles.operatorWidth}px`,
  height: '100%',
}))
export let FilterMoveTarget = FilterMoveDropTarget(({ isOver }) => ({
  width: '100%',
  height: isOver ? '50px' : '15px',
  marginTop: '-15px',
}))
