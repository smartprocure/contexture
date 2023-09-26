import React from 'react'
import { observer } from 'mobx-react'
import F from 'futil'
import styles from '../styles/index.js'
import Indentable from './preview/Indentable.js'
import FilterContents from './FilterContents.js'
import useFilterDragSource from './DragDrop/FilterDragSource.js'
import { oppositeJoin, indent } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'

let Rule = ({ node, parent, tree, style, theme, ...props }) => {
  const [{ isDragging }, drag] = useFilterDragSource({ node, tree, ...props })
  let hover = useLensObject({
    indent: false,
    remove: false,
    rule: false,
  })
  // hover.indent = [true]
  return (
    <div ref={drag} style={style}>
      <Indentable
        theme={theme}
        parent={parent}
        indent={hover.indent}
        isLeaf={true}
        style={{ marginBottom: styles.ruleGutter }}
      >
        <div
          style={{
            padding: '10px',
            display: 'flex',
            minHeight: styles.operatorHeight * 2,
            borderRadius: '5px',
            borderWidth: styles.lineWidth,
            borderStyle: 'solid',
            background: 'white',
            ...styles.bdJoin(parent),
            ...(F.view(hover.remove) && {
              borderStyle: 'dashed',
              opacity: 0.5,
              ...styles.bgStriped,
            }),
            ...(isDragging && { opacity: 0.5 }),
            ...(F.view(hover.rule) && { background: styles.background }),
          }}
          {...F.domLens.hover(hover.rule)}
        >
          <FilterContents {...{ node, tree, ...props }} style={{ flex: 1 }} />
          <theme.ButtonGroup
            style={{
              height: 'fit-content',
              ...(F.view(hover.rule) || { visibility: 'hidden' }),
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
              <theme.Icon icon="NextPage" />
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
        </div>
      </Indentable>
    </div>
  )
}

export default observer(Rule)
