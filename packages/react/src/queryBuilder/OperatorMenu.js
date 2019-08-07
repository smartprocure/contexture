import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import F from 'futil-js'
import styles from '../styles'
import { oppositeJoin, indent } from '../utils/search'
let { btn, joinColor, bgJoin } = styles

let OperatorMenu = observer(({ node, hover, tree, parent }) => (
  <div>
    {_.map(
      join =>
        node.join !== join && (
          <div
            key={join}
            {...F.domLens.hover(x => F.set(x && join, hover.join))}
            style={{ ...btn, ...bgJoin(join) }}
            onClick={() => tree.mutate(node.path, { join })}
          >
            To {join.toUpperCase()}
          </div>
        ),
      ['and', 'or', 'not']
    )}
    <div>
      <div
        style={{
          ...btn,
          color: joinColor(oppositeJoin(parent)),
          marginTop: 5,
        }}
        {...F.domLens.hover(hover.wrap)}
        onClick={() => {
          indent(tree, parent, node)
          F.off(hover.wrap)()
        }}
      >
        Wrap in {oppositeJoin(parent).toUpperCase()}
      </div>
    </div>
    <div>
      <div
        {...F.domLens.hover(hover.remove)}
        style={{ ...btn, marginTop: 5 }}
        onClick={() => tree.remove(node.path)}
      >
        Remove
      </div>
    </div>
  </div>
))
OperatorMenu.displayName = 'OperatorMenu'

export default OperatorMenu
