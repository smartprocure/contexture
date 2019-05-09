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

let GroupItem = FilterDragSource(args => {
  let {
    child,
    tree,
    index,
    state,
    root,
    isRoot,
    parentTree,
    connectDragSource,
    //connectDragPreview, isDragging
  } = args
  return connectDragSource(
    <div
      style={{
        ...styles.dFlex,
        ...(index === tree.children.length - 1 &&
          !root.adding && { background }),
      }}
    >
      {!(isRoot && tree.children.length === 1) && (
        <Operator
          {...{ tree, child, root, parentTree, index, parent: state }}
        />
      )}
      {child.children ? (
        <Group tree={child} root={root} parentTree={tree} />
      ) : (
        <Rule {...{ ...args, node: child }} />
      )}
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
  args => {
    let { tree, root, state, isRoot } = args
    return (
      <Indentable tree={tree} indent={state.lens.wrapHover}>
        <div
          style={{
            ...styles.conditions,
            ...(!isRoot && styles.w100),
            ...styles.bdJoin(tree),
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
                  <FilterIndentTarget {...{ ...args, child, index }} />
                  {/*<FilterMoveTarget index={index} tree={tree} />*/}
                  <GroupItem {...{ ...args, child, index }} />
                  {/*index !== (tree.children.length-1) &&*/ !child.children && (
                    <FilterMoveTarget {...{ ...args, child, index }} />
                  )}
                </div>
              ),
              _.toArray(tree.children)
            )}
            {/*<FilterMoveTarget index={tree.children.length} tree={tree} /> */}
            {root.adding && (
              <AddPreview
                onClick={() => {
                  root.add(tree)
                }}
                join={tree.join}
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
