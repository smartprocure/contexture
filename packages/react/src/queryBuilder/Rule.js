import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'
import F from 'futil'
import styles from '../styles/index.js'
import Indentable from './preview/Indentable.js'
import FilterContents from './FilterContents.js'
import FilterDragSource from './DragDrop/FilterDragSource.js'
import { oppositeJoin, indent } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'

let Rule = ({
  node,
  parent,
  tree,
  connectDragSource,
  isDragging,
  ...props
}) => {
  let hover = useLensObject({
    indent: false,
    remove: false,
    rule: false,
  })
  return connectDragSource(
    <div style={styles.w100}>
      <Indentable parent={parent} indent={hover.indent}>
        <div
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
          <FilterContents {...{ node, tree, ...props }} />
          <div
            style={{
              ...(F.view(hover.rule) || { visibility: 'hidden' }),
              minWidth: 82,
            }}
          >
            <button
              {...F.domLens.hover(hover.indent)}
              style={{
                color: styles.joinColor(oppositeJoin(parent.join)),
                ...styles.btn,
                ...styles.roundedRight0,
              }}
              onClick={() => indent(tree, parent, node)}
            >
              {'>'}
            </button>
            <button
              {...F.domLens.hover(hover.remove)}
              style={{
                ...styles.btn,
                ...styles.roundedLeft0,
                marginLeft: '-1px',
              }}
              onClick={() => tree.remove(node.path)}
            >
              X
            </button>
          </div>
        </div>
      </Indentable>
    </div>
  )
}

export default _.flow(observer, FilterDragSource)(Rule)
