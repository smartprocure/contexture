import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import { StripedLoader } from '../greyVest'
import { wrapDisplayName } from './react'
import { withTheme } from './theme'

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
  )(({ Loader, ...props }) => {
    let { theme = {}, node } = props
    Loader = Loader || theme.Loader || StripedLoader
    return (
      <Loader loading={node && node.updating}>
        <Component node={node} {...props} />
      </Loader>
    )
  })

// I am a band-aid, please rip me off as quickly as possible
export let withInlineLoader = Component =>
  _.flow(
    wrapDisplayName('withInlineLoader', Component),
    observer
  )(({ Loader, ...props }) => {
    let { theme = {}, node } = props
    Loader = Loader || theme.Loader || StripedLoader
    return (
      <Loader
        loading={node && node.updating}
        style={{ display: 'inline-block' }}
      >
        <Component {...props} />
      </Loader>
    )
  })

export let contexturify = _.flow(
  observer,
  withLoader,
  withNode,
  withTheme
)

export let contexturifyWithoutLoader = _.flow(
  observer,
  withNode,
  withTheme
)

// this is used for the text components
export let withTreeLens = Component =>
  wrapDisplayName('withTreeLens', Component)(({ prop = 'value', ...props }) => (
    <Component
      {...{ lens: props.tree.lens(props.node.path, prop), ...props }}
    />
  ))
