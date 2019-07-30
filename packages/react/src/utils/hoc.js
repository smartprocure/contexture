import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import StripedLoader from './StripedLoader'

export let withNode = (Component, { allowEmptyNode = false } = {}) => ({
  tree,
  node,
  path,
  ...props
}) => {
  node = node || tree.getNode(path)

  if (!node && path && !allowEmptyNode)
    throw Error(`Node not provided, and couldn't find node at ${path}`)

  return <Component {...{ tree, node, path, ...props }} />
}

export let withLoader = Component =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node.updating}>
      <Component node={node} {...props} />
    </Loader>
  ))

export let contexturify = _.flow(
  withNode,
  withLoader,
)

export let withTreeLens = Component =>
  ({ tree, node, prop = 'value', ...props }) => (
    <Component {...{ tree, node, lens: tree.lens(node.path, prop), ...props }} />
  )
