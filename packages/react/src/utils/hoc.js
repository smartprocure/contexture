import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import StripedLoader from './StripedLoader'

export let withNode = Component => props => {
  let { tree, node, path } = props
  node = node || (tree && path && tree.getNode(path))

  if (!node)
    throw Error(`Node not provided, and couldn't find node at ${path}`)

  return <Component {...props} node={node} />
}

export let withLoader = (Component, loaderProps) =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating} {...loaderProps}>
      <Component node={node} {...props} />
    </Loader>
  ))

export let contexturify = (Component, loaderProps) =>
  _.flow(
    observer,
    withNode,
    c => withLoader(c, loaderProps)
  )(Component)

// this is used for the text components
export let withTreeLens = Component => ({ prop = 'value', ...props }) => (
  <Component {...{ lens: props.tree.lens(props.node.path, prop), ...props }} />
)
