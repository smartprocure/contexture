import React from 'react'
import { Provider } from 'mobx-react'
import ContextureMobx from './utils/contexture-mobx'

export default ({ types, service, children, nodeKey, ...props }) => (
  <Provider
    tree={ContextureMobx({ types, service })({
      key: nodeKey || 'root',
      type: 'group',
      children: [],
      ...props,
    })}
  >
    {children}
  </Provider>
)
