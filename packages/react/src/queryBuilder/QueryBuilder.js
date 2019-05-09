import React from 'react'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import { observable , toJS} from 'mobx'
import { Provider } from 'mobx-react'
import DDContext from './DragDrop/DDContext'
import { Component } from '../utils/mobx-react-utils'
import Group from './Group'
import styles from '../styles'
import { oppositeJoin } from '../utils/search'
import { DefaultNodeProps } from '../utils/schema'

let { background } = styles
let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

let blankNode = () => ({ key: randomString() })

let ContextureClientBridge = (
  Tree,
  fields,
  defaultNodeProps = DefaultNodeProps
) => {
  return {
    lens: Tree.lens,
    getNode: Tree.getNode,
    add: tree => Tree.add(tree.path, blankNode()),
    remove: (tree, node) => Tree.remove(node.path),
    join: (tree, join) => Tree.mutate(tree.path, { join }),
    mutate: Tree.mutate,
    typeChange: (node, type) =>
      Tree.replace(_.toArray(node.path), toJS({
        type,
        ..._.pick(['key', 'field'], node),
        ...defaultNodeProps(node.field, fields, type, Tree),
      })),
    move: (tree, node, targetTree, index) =>
      Tree.move(_.toArray(node.path), { path: _.toArray(targetTree.path), index }),
    indent: (tree, node, skipDefaultNode)  => {
      // Reactors:
      //   OR -> And, nothing
      //   AND -> OR, others if has value
      //   to/from NOT, others if has value
      let key = randomString()
      Tree.wrapInGroup(_.toArray(node.path), { key, join: oppositeJoin([tree || node].join) })
      if (!skipDefaultNode)
        Tree.add(tree ? [...tree.path, key] : [key], blankNode())
      return Tree.getNode([...tree.path, key])
    }
  }
}

export default DDContext(
  Component(
    (
      { tree: iTree, types: iTypes, typeComponents: iTypeComponents },
      {
        typeComponents = iTypeComponents,
        types = iTypes || typeComponents,
        tree = iTree,
        fields,
        defaultNodeProps,
      }
    ) => ({
      types,
      state: observable({
        adding: false,
        ...ContextureClientBridge(tree, fields, defaultNodeProps)
      })
    }),
    ({
      state,
      path,
      fields,
      types = {},
      Button = 'button',
      mapNodeToProps,
      MissingTypeComponent,
    }) => (
      <Provider
        ContextureButton={Button}
        {...{ fields, types, mapNodeToProps, MissingTypeComponent }}
      >
        <div style={{ background }}>
          {state.getNode(path) && (
            <Group tree={state.getNode(path)} root={state} isRoot={true} />
          )}
          <Button
            onClick={() => {
              state.adding = !state.adding
            }}
          >
            {state.adding ? 'Cancel' : 'Add Filter'}
          </Button>
        </div>
      </Provider>
    ),
    'QueryBuilder'
  ),
  { allowEmptyNode: true }
)
