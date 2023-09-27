import React from 'react'
import { observer } from 'mobx-react'
import F from 'futil'
import styles from '../styles/index.js'
import Indentable from './preview/Indentable.js'
import FilterContents from './FilterContents.js'
import { FilterIndentTarget } from './DragDrop/IndentTarget.js'
import useFilterDragSource from './DragDrop/FilterDragSource.js'
import { useFilterDropTarget } from './DragDrop/FilterDropTarget.js'
import { oppositeJoin, indent } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'

let Rule = ({ index, node, parent, tree, style, theme, ...props }) => {
  const [{ isDragging }, drag] = useFilterDragSource({ node, tree, ...props })
  let hover = useLensObject({
    indent: false,
    remove: false,
    rule: false,
  })

  let [{ canDrop, isOver }, drop] = useFilterDropTarget({
    drop(source) {
      tree.move(source.node.path, {
        path: parent.path,
        index: index + 1,
      })
    },
  })

  return (
    <Indentable
      parent={parent}
      indent={hover.indent}
      theme={theme}
      isLeaf={true}
      style={{
        ...style,
        marginBottom: !canDrop && styles.ruleGutter,
      }}
    >
      <div
        ref={drag}
        style={{
          ...styles.condition,
          ...styles.bdJoin(parent),
          ...(F.view(hover.remove) && {
            borderStyle: 'dashed',
            opacity: 0.25,
            ...styles.bgStriped,
          }),
          ...(isDragging && { opacity: 0.25 }),
          ...(F.view(hover.rule) && { background: styles.background }),
        }}
        {...F.domLens.hover(hover.rule)}
      >
        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          <FilterContents {...{ node, tree, ...props }} style={{ flex: 1 }} />
          <theme.ButtonGroup
            style={{
              height: 'fit-content',
              visibility: (!F.view(hover.rule) || isDragging) && 'hidden',
            }}
          >
            <theme.Button
              {...F.domLens.hover(hover.indent)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                width: `${styles.operatorWidth}px`,
                height: `${styles.operatorHeight}px`,
                background: styles.joinColor(oppositeJoin(parent?.join)),
              }}
              onClick={() => indent(tree, parent, node)}
            >
              {'>'}
            </theme.Button>
            <theme.Button
              {...F.domLens.hover(hover.remove)}
              onClick={() => tree.remove(node.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                width: `${styles.operatorWidth}px`,
                height: `${styles.operatorHeight}px`,
              }}
            >
              X
            </theme.Button>
          </theme.ButtonGroup>
          <FilterIndentTarget child={node} node={parent} tree={tree} />
        </div>
      </div>
      {canDrop && (
        <div
          ref={drop}
          style={{
            ...styles.bgPreview(parent),
            height: isOver
              ? styles.operatorWidth
              : styles.ruleGutter - styles.ruleGutter / 2,
            margin: styles.ruleGutter / 4,
            borderRadius: styles.borderRadius,
          }}
        />
      )}
    </Indentable>
  )
}

export default observer(Rule)
