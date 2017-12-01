import React from 'react'
import FilterDropTarget from './FilterDropTarget'
import styles from '../../styles'

// Move
let FilterMoveSpec = {
  drop(props, monitor) {
    let {tree, node} = monitor.getItem()
    props.root.move(tree, node, props.tree, props.index)
  }
}
let FilterMoveDropTarget = style => FilterDropTarget(FilterMoveSpec)(({
  tree, connectDropTarget, isOver, canDrop
}) => connectDropTarget(canDrop ? <div style={{
  ...styles.bgPreview(tree),
  ...style({isOver})
}} /> : <div />))

export let OperatorMoveTarget = FilterMoveDropTarget(() => ({
  width: `${styles.operatorWidth}px`,
  height: '100%'
}))
export let FilterMoveTarget = FilterMoveDropTarget(({isOver}) => ({
  ...styles.w100,
  height: isOver ? '50px' : '15px',
  marginTop: '-15px'
}))