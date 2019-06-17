import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { Component } from '../utils/mobx-react-utils'
import styles from '../styles'
import { oppositeJoin } from '../utils/search'
let { btn, joinColor, bgJoin } = styles

import { indent } from '../utils/tree'

let OperatorMenu = ({ node, parentState, tree, parent }) => (
  <div>
    {_.map(
      join =>
        node.join !== join && (
          <div
            key={join}
            {...F.domLens.hover(x => (parentState.joinHover = x && join))}
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
        {...F.domLens.hover(parentState.lens.wrapHover)}
        onClick={() => {
          indent(tree, parent, node)
          F.off(parentState.lens.wrapHover)()
        }}
      >
        Wrap in {oppositeJoin(parent).toUpperCase()}
      </div>
    </div>
    <div>
      <div
        {...F.domLens.hover(parentState.lens.removeHover)}
        style={{ ...btn, marginTop: 5 }}
        onClick={() => tree.remove(node.path)}
      >
        Remove
      </div>
    </div>
  </div>
)
OperatorMenu.displayName = 'OperatorMenu'

export default Component(OperatorMenu)
