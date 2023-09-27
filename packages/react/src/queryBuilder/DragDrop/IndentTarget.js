import React from 'react'
import { useFilterDropTarget } from './FilterDropTarget.js'
import styles from '../../styles/index.js'
import { oppositeJoin, indent } from '../../utils/search.js'

export let FilterIndentTarget = ({ child, node, tree }) => {
  const [{ canDrop, dragItem }, drop] = useFilterDropTarget({
    drop(source) {
      let isSelf = child === source.node
      if (isSelf) {
        tree.remove(child)
      } else {
        let newGroup = indent(tree, node, child, true)
        tree.move(source.node.path, {
          path: newGroup.path,
          index: 1,
        })
      }
    },
  })
  return (
    canDrop && (
      <div
        ref={drop}
        style={{
          width: '50%',
          height: '100%',
          borderRadius: styles.borderRadius,
          position: 'absolute',
          right: 0,
          ...(dragItem.node === child
            ? styles.bgStriped
            : styles.bgPreview(oppositeJoin(node.join))),
          zIndex: 100,
        }}
      />
    )
  )
}
