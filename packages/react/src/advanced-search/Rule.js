import React from 'react'
import { Component, lenservable, hover } from '../utils/mobx-react-utils'
import styles from '../styles'
import Indentable from './preview/Indentable'
import FilterContents from './FilterContents'
import FilterDragSource from './DragDrop/FilterDragSource'
import { oppositeJoin } from '../searchUtils'

let Rule = args => {
  let {
    state,
    node,
    tree,
    root,
    fields,
    connectDragSource,
    // connectDragPreview,
    isDragging,
  } = args
  return connectDragSource(
    <div style={styles.w100}>
      <Indentable tree={tree} indent={state.lens.indentHover}>
        <div
          style={{
            ...styles.condition,
            ...styles.bdJoin(tree),
            ...(state.removeHover && {
              borderStyle: 'dashed',
              opacity: 0.25,
              ...styles.bgStriped,
            }),
            ...(isDragging && { opacity: 0.25 }),
            ...(state.ruleHover && { background: 'rgba(0, 0, 0, 0.05)' }),
          }}
          {...hover(state.lens.ruleHover)}
        >
          <FilterContents {...{ node, root, tree, fields }} />
          <div
            style={{
              ...(state.ruleHover || { visibility: 'hidden' }),
              minWidth: 82,
            }}
          >
            <button
              {...hover(state.lens.indentHover)}
              style={{
                color: styles.joinColor(oppositeJoin(tree.join)),
                ...styles.btn,
                ...styles.roundedRight0,
              }}
              onClick={() => root.indent(tree, node)}
            >
              >
            </button>
            <button
              {...hover(state.lens.removeHover)}
              style={{
                ...styles.btn,
                ...styles.roundedLeft0,
                marginLeft: '-1px',
              }}
              onClick={() => root.remove(tree, node)}
            >
              X
            </button>
          </div>
        </div>
      </Indentable>
    </div>
  )
}

export default FilterDragSource(
  Component(
    () => ({
      state: lenservable({
        indentHover: false,
        removeHover: false,
        ruleHover: false,
      }),
    }),
    Rule
  )
)
