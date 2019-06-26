import React from 'react'
import F from 'futil-js'
import { Component, lenservable } from '../utils/mobx-react-utils'
import styles from '../styles'
import Indentable from './preview/Indentable'
import FilterContents from './FilterContents'
import FilterDragSource from './DragDrop/FilterDragSource'
import { oppositeJoin, indent } from '../utils/search'

let Rule = ({ state, node, parent, tree, connectDragSource, isDragging }) =>
  connectDragSource(
    <div style={styles.w100}>
      <Indentable node={parent} indent={state.lens.indentHover}>
        <div
          style={{
            ...styles.condition,
            ...styles.bdJoin(parent),
            ...(state.removeHover && {
              borderStyle: 'dashed',
              opacity: 0.25,
              ...styles.bgStriped,
            }),
            ...(isDragging && { opacity: 0.25 }),
            ...(state.ruleHover && { background: styles.background }),
          }}
          {...F.domLens.hover(state.lens.ruleHover)}
        >
          <FilterContents {...{ node, tree }} />
          <div
            style={{
              ...(state.ruleHover || { visibility: 'hidden' }),
              minWidth: 82,
            }}
          >
            <button
              {...F.domLens.hover(state.lens.indentHover)}
              style={{
                color: styles.joinColor(oppositeJoin(parent.join)),
                ...styles.btn,
                ...styles.roundedRight0,
              }}
              onClick={() => indent(tree, parent, node)}
            >
              >
            </button>
            <button
              {...F.domLens.hover(state.lens.removeHover)}
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

export default FilterDragSource(
  Component(
    () => ({
      state: lenservable({
        indentHover: false,
        removeHover: false,
        ruleHover: false,
      }),
    }),
    Rule,
    'Rule'
  )
)
