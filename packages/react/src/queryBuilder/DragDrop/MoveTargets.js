import React from 'react'
import FilterDropTarget from './FilterDropTarget'
import styles from '../../styles'

// Move
let FilterMoveSpec = {
  drop(props, monitor) {
    let { node } = monitor.getItem()
    props.tree.move(node.path, {
      path: props.node.path,
      index: props.index,
    })
  },
}
let FilterMoveDropTarget = style =>
  FilterDropTarget(FilterMoveSpec)(
    ({ node, connectDropTarget, isOver, canDrop }) =>
      connectDropTarget(
        canDrop ? (
          <div
            style={{
              ...styles.bgPreview(node),
              ...style({ isOver }),
            }}
          />
        ) : (
          <div />
        )
      )
  )

export let OperatorMoveTarget = FilterMoveDropTarget(() => ({
  width: `${styles.operatorWidth}px`,
  height: '100%',
}))
export let FilterMoveTarget = FilterMoveDropTarget(({ isOver }) => ({
  ...styles.w100,
  height: isOver ? '50px' : '15px',
  marginTop: '-15px',
}))
