import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import styles from '../styles/index.js'
import Indentable from './preview/Indentable.js'
import AddPreview from './preview/AddPreview.js'
import Operator from './Operator.js'
import Rule from './Rule.js'
import useFilterDragSource from './DragDrop/FilterDragSource.js'
import { FilterIndentTarget } from './DragDrop/IndentTarget.js'
import { FilterMoveTarget } from './DragDrop/MoveTargets.js'
import { blankNode } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'
import { setDisplayName } from 'react-recompose'

let GroupItem = (props) => {
  let { child, node, index, tree, adding, isRoot, parent, hover } = props
  const [{ isDragging }, drag] = useFilterDragSource(props)
  let Component = child.children ? Group : Rule
  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        ...(index === node.children.length - 1 &&
          !F.view(adding) && { background: styles.background }),
        ...(isDragging && { opacity: 0.25 }),
      }}
    >
      {!(isRoot && node.children.length === 1) && (
        <Operator {...{ node, child, tree, parent, index, hover }} />
      )}
      <Component {...props} node={child} parent={node} />
    </div>
  )
}

// We need to observe this here and not on the export because Group is
// referenced elsewhere in the file
let Group = _.flow(
  setDisplayName('Group'),
  observer
)((props) => {
  let { parent, node, tree, adding, isRoot } = props
  let hover = useLensObject({ wrap: false, join: '', remove: false })
  return (
    <Indentable parent={parent} indent={hover.wrap}>
      <div
        style={{
          borderLeft: `${styles.lineWidth}px solid black`,
          paddingLeft: `${(styles.operatorWidth - styles.lineWidth) / 2}px`,
          marginLeft: `${(styles.operatorWidth - styles.lineWidth) / 2}px`,
          width: !isRoot && '100%',
          ...styles.bdJoin(node),
          ...(F.view(hover.remove) && {
            ...styles.bgStriped,
            borderColor: styles.background,
          }),
        }}
      >
        <div
          style={{
            width: '100%',
            marginLeft: `-${styles.operatorWidth}px`,
            ...(F.view(hover.remove) && { opacity: 0.25 }),
          }}
        >
          {F.mapIndexed(
            (child, index) => (
              <div key={child.key + index}>
                <FilterIndentTarget {...{ ...props, child, index }} />
                {/*<FilterMoveTarget index={index} tree={tree} />*/}
                <GroupItem {...{ ...props, child, index, adding, hover }} />
                {
                  /*index !== (tree.children.length-1) &&*/ !child.children && (
                    <FilterMoveTarget {...{ ...props, child, index }} />
                  )
                }
              </div>
            ),
            _.toArray(node.children)
          )}
          {/*<FilterMoveTarget index={tree.children.length} tree={tree} /> */}
          {F.view(adding) && (
            <AddPreview
              onClick={() => {
                tree.add(node.path, blankNode())
              }}
              join={node.join}
              style={{
                marginLeft: 0,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            />
          )}
        </div>
      </div>
    </Indentable>
  )
})

export default Group
