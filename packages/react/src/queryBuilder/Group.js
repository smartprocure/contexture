import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
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
import { useLensObject } from '../utils/react'

let GroupItem = FilterDragSource(props => {
  let {
    child,
    node,
    index,
    tree,
    adding,
    isRoot,
    parent,
    connectDragSource,
    hover,
  } = props
  let Component = child.children ? Group : Rule
  return connectDragSource(
    <div
      style={{
        ...styles.dFlex,
        ...(index === node.children.length - 1 &&
          !F.view(adding) && { background }),
      }}
    >
      {!(isRoot && node.children.length === 1) && (
        <Operator
          {...{ node, child, tree, parent, index, hover }}
        />
      )}
      <Component {...props} node={child} parent={node} />
    </div>
  )
})

let Group = observer(
  props => {
    let { parent, node, tree, adding, isRoot } = props
    let hover = useLensObject({wrap: false, join: '', remove: false})
    return (
      <Indentable parent={parent} indent={hover.wrap}>
        <div
          style={{
            ...styles.conditions,
            ...(!isRoot && styles.w100),
            ...styles.bdJoin(node),
            ...(F.view(hover.remove) && {
              ...styles.bgStriped,
              borderColor: background,
            }),
          }}
        >
          <div
            style={{
              ...styles.conditionsInner,
              ...(F.view(hover.remove) && { opacity: 0.25 }),
            }}
          >
            {F.mapIndexed(
              (child, index) => (
                <div key={child.key + index}>
                  <FilterIndentTarget {...{ ...props, child, index }} />
                  {/*<FilterMoveTarget index={index} tree={tree} />*/}
                  <GroupItem {...{ ...props, child, index, adding, hover }} />
                  {/*index !== (tree.children.length-1) &&*/ !child.children && (
                    <FilterMoveTarget {...{ ...props, child, index }} />
                  )}
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
  }
)
Group.displayName = 'Group'

export default Group
