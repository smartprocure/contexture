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
import { blankNode } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'
import { setDisplayName } from 'react-recompose'

let GroupItem = observer((props) => {
  let {
    child,
    node,
    index,
    tree,
    adding,
    isRoot,
    isLast,
    parent,
    hover,
    theme,
  } = props
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
        <Operator
          {...{
            node,
            child,
            tree,
            parent,
            index,
            hover,
            isLast,
            theme,
            adding,
          }}
        />
      )}
      <Component
        {...props}
        theme={theme}
        node={child}
        parent={node}
        index={index}
        style={{
          flex: 1,
          zIndex: 1,
        }}
      />
    </div>
  )
})

// We need to observe this here and not on the export because Group is
// referenced elsewhere in the file
let Group = _.flow(
  setDisplayName('Group'),
  observer
)((props) => {
  let { parent, node, tree, adding, isRoot, style, theme } = props
  let hover = useLensObject({ wrap: false, join: '', remove: false })
  let children = _.toArray(node.children)
  return (
    <Indentable
      theme={theme}
      parent={parent}
      indent={hover.wrap}
      style={{
        ...style,
        marginBottom: F.view(hover.wrap) && styles.ruleGutter,
      }}
    >
      <div
        style={{
          width: !isRoot && '100%',
          ...(F.view(hover.remove) && {
            ...styles.bgStriped,
            borderColor: styles.background,
          }),
        }}
      >
        <div
          style={{
            width: '100%',
            ...(F.view(hover.remove) && { opacity: 0.25 }),
          }}
        >
          {F.mapIndexed(
            (child, index) => (
              <GroupItem
                key={child.key + index}
                {...{ ...props, child, index, adding, hover, theme }}
                isLast={index === _.size(children) - 1}
              />
            ),
            children
          )}
          {F.view(adding) && (
            <AddPreview
              theme={theme}
              join={node.join}
              onClick={() => tree.add(node.path, blankNode())}
              style={{ marginBottom: styles.ruleGutter }}
            />
          )}
        </div>
      </div>
    </Indentable>
  )
})

export default Group
