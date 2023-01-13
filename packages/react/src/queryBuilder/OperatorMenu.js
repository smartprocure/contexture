import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'
import F from 'futil'
import styles from '../styles/index.js'
import { oppositeJoin, indent } from '../utils/search.js'
let { btn, joinColor, bgJoin } = styles

let OperatorMenu = ({ node, hover, tree, parent, child }) => (
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
          color: joinColor(oppositeJoin((parent || node).join)),
          marginTop: 5,
        }}
        {...F.domLens.hover(hover.wrap)}
        onClick={() => {
          indent(tree, node, child)
          F.off(hover.wrap)()
        }}
      >
        Wrap in {oppositeJoin((parent || node).join).toUpperCase()}
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
)

export default observer(OperatorMenu)
