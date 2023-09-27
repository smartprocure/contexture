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
let { background } = styles
import { blankNode } from '../utils/search.js'
import { useLensObject } from '../utils/react.js'
import { setDisplayName } from 'react-recompose'

let GroupItem = observer((props) => {
  let { child, node, index, tree, adding, isRoot, parent, hover, theme } = props
  const [{ isDragging }, drag] = useFilterDragSource(props)
  let Component = child.children ? Group : Rule
  return (
    <div
      ref={drag}
      style={{
        ...styles.dFlex,
        ...(index === node.children.length - 1 &&
          !F.view(adding) && { background }),
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
            theme,
            adding,
          }}
        />
      )}
      <Component
        {...props}
        node={child}
        parent={node}
        theme={theme}
        index={index}
        style={{ flex: 1, zIndex: 1 }}
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
  return (
    <Indentable
      parent={parent}
      indent={hover.wrap}
      theme={theme}
      style={{
        ...style,
        marginBottom: F.view(hover.wrap) && styles.ruleGutter,
      }}
    >
      <div
        style={{
          ...(!isRoot && styles.w100),
          ...(F.view(hover.remove) && {
            ...styles.bgStriped,
            borderColor: background,
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
              />
            ),
            _.toArray(node.children)
          )}
          {F.view(adding) && (
            <AddPreview
              onClick={() => {
                tree.add(node.path, blankNode())
              }}
              join={node.join}
              theme={theme}
              style={{ marginBottom: styles.ruleGutter }}
            />
          )}
        </div>
      </div>
    </Indentable>
  )
})

export default Group
