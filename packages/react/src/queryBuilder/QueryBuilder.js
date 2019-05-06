import React from 'react'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import { observable } from 'mobx'
import { Provider } from 'mobx-react'
import DDContext from './DragDrop/DDContext'
import { Component } from '../utils/mobx-react-utils'
import Group from './Group'
import styles from '../styles'
import { oppositeJoin } from '../utils/search'
import treeUtils from '../utils/tree'
import { DefaultNodeProps } from '../utils/schema'

let { background } = styles
let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

let { encode } = F.encoder('/') // todo get from client

let blankNode = () => ({ key: randomString() })
let replaceOn = (list, from, to) => list.splice(list.indexOf(from), 1, to)

let ContextureClientBridge = (
  Types,
  Tree,
  fields,
  defaultNodeProps = DefaultNodeProps
) => {
  // not sure why reassignment is needed - its 2am and that makes it work... fix tomorrow!
  Tree.addActions(({ flat }) => ({
    updatePath(node, to) {
      let from = node.path
      node.path = to
      if (from) delete flat[encode(from)]
      flat[encode(to)] = node
    },
    reparentPaths(node, oldParent, newParent) {
      treeUtils.walk(node => {
        Tree.updatePath(node, [
          ...newParent,
          ...node.path.slice(oldParent.length),
        ])
      })(node)
    },
  }))
  return {
    lens: Tree.lens,
    getNode: Tree.getNode,
    add: tree => Tree.add(tree.path, blankNode()),
    remove: (tree, node) => Tree.remove(node.path),
    join: (tree, join) => Tree.mutate(tree.path, { join }),
    mutate: Tree.mutate,
    typeChange(node, type) {
      let { key, path, field } = node
      let parentPath = _.dropRight(1, path)
      let tree = Tree.getNode(parentPath)
      let index = tree.children.indexOf(node)
      Tree.remove(path)
      Tree.add(parentPath, {
        key,
        type,
        field,
        ...defaultNodeProps(field, fields, type, tree),
      })
      let newNode = Tree.getNode(path)
      // Move to same index
      tree.children.remove(newNode) // pop since add does a push
      tree.children.splice(index, 0, newNode)
    },
    move(tree, node, targetTree, index) {
      // if tree != target tree, do remove/add/move for reactors
      // need to update paths
      tree.children.splice(tree.children.indexOf(node), 1)
      targetTree.children.splice(index, 0, node)
    },
    indent(tree, node, skipDefaultNode) {
      // Reactors:
      //   OR -> And, nothing
      //   AND -> OR, others if has value
      //   to/from NOT, others if has value
      if (!tree) {
        // Indent in place, only needs to happen at root and only works if node is a group
        let key = randomString()
        let newGroup = observable({
          key,
          join: node.join,
          children: node.children,
          path: [...node.path, key],
        })
        node.children = [newGroup]
        node.join = oppositeJoin(node.join)

        Tree.reparentPaths(newGroup, node.path, newGroup.path)
        Tree.add(node.path, blankNode())
      } else {
        let newGroup = observable({
          key: randomString(),
          join: oppositeJoin(tree.join),
          children: [node],
        })
        replaceOn(tree.children, node, newGroup)

        // Update paths
        Tree.updatePath(newGroup, [..._.dropRight(1, node.path), newGroup.key])
        Tree.reparentPaths(node, _.dropRight(1, node.path), newGroup.path)

        if (!skipDefaultNode) Tree.add(newGroup.path, blankNode())

        return newGroup
      }
    },
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
        ...ContextureClientBridge(types, tree, fields, defaultNodeProps),
      }),
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
