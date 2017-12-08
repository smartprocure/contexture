import React from 'react'
import _ from 'lodash/fp'
import { observable, action } from 'mobx'
import DDContext from './DragDrop/DDContext'
import { Component } from '../mobx-react-utils'
import Group from './Group'
import styles from '../styles'
import { oppositeJoin } from '../searchUtils'
import treeUtils from '../treeUtils'
let { background } = styles
let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

export let NewNode = Types => (type, key) => {
  let node = observable({
    key: key || randomString(),
    type,
  })
  _.getOr(_.noop, `${type}.init`, Types)(node)
  return node
}
export let DefaultNode = Types => key => NewNode(Types)('query', key)

// Basic contexture client bridge
let ContextureClientBridge = (Types, Tree) => ({
  add(tree) {
    let node = DefaultNode(Types)()
    node.data.words.push({ word: 'hi' })
    Tree.add(tree.path.split('->'), node)
  },
  remove: (tree, node) => Tree.remove(node.path.split('->')),
  join: (tree, join) => Tree.mutate(tree.path.split('->'), { join }),
})

// Basic observable tree bridge
let ObservableTreeBridge = Types => ({
  add(tree) {
    let node = DefaultNode(Types)()
    node.data.words.push({
      word: 'hi',
    })
    tree.children.push(node)
  },
  remove(tree, node) {
    tree.children.remove(node)
  },
  join(tree, join) {
    tree.join = join
  },
  indent(tree, node, skipDefaultNode) {
    if (!tree) {
      node.children = [
        observable({
          key: Math.random(),
          join: node.join,
          children: node.children,
        }),
        observable(DefaultNode(Types)()),
      ]
      node.join = oppositeJoin(node.join)
    } else {
      let index = tree.children.slice().indexOf(node)
      tree.children.remove(node)
      let newGroup = observable({
        key: Math.random(),
        join: oppositeJoin(tree.join),
        children: [node, ...(!skipDefaultNode && [DefaultNode(Types)()])],
      })
      tree.children.splice(index, 0, newGroup)
      return newGroup
    }
  },
  move(tree, node, targetTree, index) {
    tree.children.remove(node)
    targetTree.children.splice(index, 0, node)
  },
  typeChange(types, node, value) {
    action(() => {
      types[value].init && types[value].init(node)
      node.type = value
    })()
  },
})

export let SearchRoot = DDContext(
  Component(
    (uselessStores, { types, tree }) => ({
      state: observable({
        adding: false,
        ...ObservableTreeBridge(types),
        ...(tree.tree && ContextureClientBridge(types, tree)),
      }),
    }),
    ({ tree, state, path, fields, types = {} }) => (
      <div style={{ background }}>
        <Group
          tree={path ? treeUtils.lookup(path, tree.tree || tree) : tree.tree || tree}
          root={{
            ...state,
            types,
          }}
          fields={fields}
          isRoot={true}
        />
        <button
          type="button"
          style={styles.btn}
          onClick={() => {
            state.adding = !state.adding
          }}
        >
          {state.adding ? 'Cancel' : 'Add Filter'}
        </button>
      </div>
    ),
    'SearchRoot'
  )
)

export default SearchRoot
