import React from 'react'
import FilterDropTarget from './FilterDropTarget'
import styles from '../../styles'
import { oppositeJoin, indent } from '../../utils/search'

// Indent
let FilterIndentSpec = {
  drop(props, monitor) {
    let source = monitor.getItem()
    let isSelf = props.child === source.node
    if (isSelf) {
      props.tree.remove(props.child)
    } else {
      let newGroup = indent(props.tree, props.node, props.child, true)
      props.tree.move(source.node.path, {
        path: newGroup.path,
        index: 1,
      })
    }
  },
}
export let FilterIndentTarget = FilterDropTarget(FilterIndentSpec)(
  ({
    child,
    node,
    connectDropTarget,
    // isOver,
    canDrop,
    dragItem,
  }) =>
    connectDropTarget(
      <div>
        {!child.children && canDrop && (
          <div
            style={{
              width: '50%',
              marginLeft: '50%',
              height: 50,
              position: 'fixed',
              ...(dragItem.node === child
                ? styles.bgStriped
                : styles.bgPreview(oppositeJoin(node.join))),
              zIndex: 100,
            }}
          />
        )}
      </div>
    )
)
