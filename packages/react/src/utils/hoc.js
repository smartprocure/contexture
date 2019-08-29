import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import StripedLoader from '../greyVest/StripedLoader'
import { wrapDisplayName } from './react'

export let withNode = Component =>
  wrapDisplayName('withNode', Component)(props => {
    let { tree, node, path } = props
    node = node || (tree && path && tree.getNode(path))

    if (!node)
      throw Error(`Node not provided, and couldn't find node at ${path}`)

    return <Component {...props} node={node} />
  })

export let withLoader = Component =>
  _.flow(
    wrapDisplayName('withLoader', Component),
    observer
  )(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating}>
      <Component node={node} {...props} />
    </Loader>
  ))

// I am a band-aid, please rip me off as quickly as possible
export let withInlineLoader = Component =>
  _.flow(
    wrapDisplayName('withInlineLoader', Component),
    observer
  )(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating} style={{ display: 'inline-block' }}>
      <Component node={node} {...props} />
    </Loader>
  ))

export let contexturify = _.flow(
  observer,
  withNode,
  withLoader
)

// this is used for the text components
export let withTreeLens = Component =>
  wrapDisplayName('withTreeLens', Component)(({ prop = 'value', ...props }) => (
    <Component
      {...{ lens: props.tree.lens(props.node.path, prop), ...props }}
    />
  ))
