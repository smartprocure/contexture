import React from 'react'
import FilterDropTarget from './FilterDropTarget'
import styles from '../../styles'
import {oppositeJoin} from '../../searchUtils'

// Indent
let FilterIndentSpec = {
  drop(props, monitor) {
    let source = monitor.getItem()
    let isSelf = props.child === source.node
    if (isSelf) {
      props.root.remove(props.tree, props.child)
    } else {
      let newGroup = props.root.indent(props.tree, props.child, true)
      props.root.move(source.tree, source.node, newGroup, 1)
    }
  }
}
export let FilterIndentTarget = FilterDropTarget(FilterIndentSpec)(({
  child, tree, root, connectDropTarget, isOver, canDrop, dragItem
}) => connectDropTarget(<div>{!child.children && canDrop && <div style={{
  width: '50%',
  marginLeft: '50%',
  height: 50,
  position: 'fixed',
  ...dragItem.node === child
    ? styles.bgStriped
    : styles.bgPreview(oppositeJoin(tree.join)),
  zIndex: 100
}} />}</div>))
