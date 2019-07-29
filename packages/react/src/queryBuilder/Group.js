import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { Component, lenservable } from '../utils/mobx-react-utils'
import styles from '../styles'
import Indentable from './preview/Indentable'
import AddPreview from './preview/AddPreview'
import Operator from './Operator'
import Rule from './Rule'
import FilterDragSource from './DragDrop/FilterDragSource'
import { FilterIndentTarget } from './DragDrop/IndentTarget'
import { FilterMoveTarget } from './DragDrop/MoveTargets'
let { background } = styles
import { blankNode } from '../utils/search'

let GroupItem = FilterDragSource(props => {
  let {
    child,
    node,
    index,
    state,
    tree,
    isRoot,
    parent,
    connectDragSource,
  } = props
  let Component = child.children ? Group : Rule
  return connectDragSource(
    <div
      style={{
        ...styles.dFlex,
        ...(index === node.children.length - 1 &&
          !tree.adding && { background }),
      }}
    >
      {!(isRoot && node.children.length === 1) && (
        <Operator
          {...{ node, child, tree, parent, index, parentState: state }}
        />
      )}
      <Component {...props} node={child} parent={node} />
    </div>
  )
})

let Group = Component(
  () => ({
    state: lenservable({
      wrapHover: false,
      joinHover: '',
      removeHover: false,
    }),
  }),
  props => {
    let { parent, node, tree, state, isRoot } = props
    return (
      <Indentable parent={parent} indent={state.lens.wrapHover}>
        <div
          style={{
            ...styles.conditions,
            ...(!isRoot && styles.w100),
            ...styles.bdJoin(node),
            ...(state.removeHover && {
              ...styles.bgStriped,
              borderColor: background,
            }),
          }}
        >
          <div
            style={{
              ...styles.conditionsInner,
              ...(state.removeHover && { opacity: 0.25 }),
            }}
          >
            {F.mapIndexed(
              (child, index) => (
                <div key={child.key + index}>
                  <FilterIndentTarget {...{ ...props, child, index }} />
                  {/*<FilterMoveTarget index={index} tree={tree} />*/}
                  <GroupItem {...{ ...props, child, index }} />
                  {/*index !== (tree.children.length-1) &&*/ !child.children && (
                    <FilterMoveTarget {...{ ...props, child, index }} />
                  )}
                </div>
              ),
              _.toArray(node.children)
            )}
            {/*<FilterMoveTarget index={tree.children.length} tree={tree} /> */}
            {tree.adding && (
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
  },
  'Group'
)

export default Group
