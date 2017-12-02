import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import {observable, action} from 'mobx'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Component} from '../mobx-react-utils'
import Group from './Group'
import styles from '../styles'
import {oppositeJoin} from '../searchUtils'
let {background} = styles
let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

export let NewNode = Types => (type, key) => {
  let node = observable({
    key: key || randomString(),
    type
  })
  Types[type].init(node)
  return node
}
export let DefaultNode = Types => key => NewNode(Types)('query', key)

// Basic contexture client bridge
let ContextureClientBridge = (Types, Tree) => ({
  add: tree => {
    let node = DefaultNode(Types)()
    node.data.words.push({word: 'hi'})
    Tree.add(tree.path.split('->'), node)
  },
  remove: (tree, node) => Tree.remove(tree.path.split('->'), node),
  join: (tree, join) => Tree.mutate(tree.path.split('->'), {join})
})

// Basic observable tree bridge
let ObservableTreeBridge = Types => ({
  add: tree => {
    let node = DefaultNode(Types)()
    node.data.words.push({
      word: 'hi'
    })
    tree.children.push(node)
  },
  remove: (tree, node) => {
    tree.children.remove(node)
  },
  join: (tree, join) => {
    tree.join = join
  },
  indent: (tree, node, skipDefaultNode) => {
    if (!tree) {
      node.children = [
        observable({
          key: Math.random(),
          join: node.join,
          children: node.children
        }),
        observable(DefaultNode(Types)())
      ]
      node.join = oppositeJoin(node.join)
    } else {
      let index = tree.children.slice().indexOf(node)
      tree.children.remove(node)
      let newGroup = observable({
        key: Math.random(),
        join: oppositeJoin(tree.join),
        children: [node, ...(!skipDefaultNode && [DefaultNode(Types)()])]
      })
      tree.children.splice(index, 0, newGroup)
      return newGroup
    }
  },
  move: (tree, node, targetTree, index) => {
    tree.children.remove(node)
    targetTree.children.splice(index, 0, node)
  },
  typeChange: (types, node, value) => {
    action(() => {
      types[value].init && types[value].init(node)
      node.type = value
    })()
  }
})

export let SearchRoot = DragDropContext(HTML5Backend)(
  Component(
    (uselessStores, {types, tree}) => ({
      state: observable({
        adding: false,
        ...ObservableTreeBridge(types),
        ...(tree.tree && ContextureClientBridge(types, tree))
      })
    }),
    ({tree, state, types = {}}) => (
      <div style={{background}}>
        <Group
          tree={tree.tree || tree}
          root={{
            ...state,
            types
          }}
          isRoot={true}
        />
        <button
          type="button"
          style={styles.btn}
          onClick={() => {
            state.adding = !state.adding
          }}>
          {state.adding ? 'Cancel' : 'Add Filter'}
        </button>
      </div>
    ),
    'SearchRoot'
  )
)

export default SearchRoot
