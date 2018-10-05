import React from 'react'
import F from 'futil-js'
import { Component, lenservable } from '../utils/mobx-react-utils'
import styles from '../styles'
import Indentable from './preview/Indentable'
import FilterContents from './FilterContents'
import FilterDragSource from './DragDrop/FilterDragSource'
import { oppositeJoin } from '../utils/search'

let Rule = ({ state, node, tree, root, connectDragSource, isDragging }) =>
  connectDragSource(
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
          {...F.domLens.hover(state.lens.ruleHover)}
        >
          <FilterContents {...{ node, root }} />
          <div
            style={{
              ...(state.ruleHover || { visibility: 'hidden' }),
              minWidth: 82,
            }}
          >
            <button
              {...F.domLens.hover(state.lens.indentHover)}
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
              {...F.domLens.hover(state.lens.removeHover)}
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
