import _ from 'lodash/fp'
import styles from './styles'
import React from 'react'
import { observable, extendObservable } from 'mobx'
import { Component, lensOf } from './mobx-react-utils'
import { value } from './actout'

// let addWord = node => {
//   node.data.words.push(observable({
//     word: '',
//     misspellings: false
//   }))
// }

let textOperatorOptions = [
  {
    value: 'containsWord',
    label: 'Field Contains',
  },
  {
    value: 'wordStartsWith',
    label: 'Word Starts With',
  },
  {
    value: 'wordEndsWith',
    label: 'Word Ends With',
  },
  {
    value: 'containsExact',
    label: 'Word Is Exactly',
  },
  {
    value: 'startsWith',
    label: 'Field Starts With',
  },
  {
    value: 'endsWith',
    label: 'Field Ends With',
  },
  {
    value: 'is',
    label: 'Field Is Exactly',
  },
]

export default {
  facet: {
    label: 'List',
    Component: Component(({ node, root }) => (
      <div>
        {_.map(
          option => (
            <div key={option.name} style={styles.flexJustifyContentBetween}>
              <div>
                <input type="checkbox" onChange={() => {
                  let value = option.name
                  let values = _.result('data.values.slice', node) || []
                  if (_.includes(value, values)) values = _.pull(value, values)
                  else values.push(value)
                  root.mutate(node, { data: { ...node.data, values } })
                }} />
                {option.name}
              </div>
              <div>{option.count}</div>
            </div>
          ),
          _.get('context.options', node)
        )}
      </div>
    )),
    init(node) {
      extendObservable(node, {
        context: {
          options: []
        },
        data: {
          fieldMode: 'word',
        },
      })
    }
  },
  query: {
    Component: Component(({ node, root }) => (
      <span>
        <input
          type="text"
          value={_.get('data.query', node)}
          onChange={e => root.mutate(node, { data: { query: e.target.value } })}
        />
      </span>
    )),
    init(node) {
      extendObservable(node, {
        data: {
          ...node.data,
          words: [],
        },
      })
    },
    fields: ['field1', 'field2', 'field3'],
  },
  number: {
    label: 'Range',
    Component: Component(({ node }) => (
      // root,
      // update
      <span>
        <input {...value(lensOf(node.data).from)} />
        <input {...value(lensOf(node.data).to)} />
      </span>
    )),
    init(node) {
      node.data = observable({
        from: undefined,
        to: undefined,
      })
    },
  },
  text: {
    Component: Component(({ node }) => (
      <span>
        <select {...value(lensOf(node.data).operator)}>
          {_.map(
            x => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ),
            textOperatorOptions
          )}
        </select>
        <select {...value(lensOf(node.data).join)}>
          <option value="all">All of these</option>
          <option value="any">Any of these</option>
          <option value="none">None of these</option>
        </select>
      </span>
    )),
    init(node) {
      node.data = observable({
        operator: undefined,
        values: [],
        join: undefined,
      })
    },
  },
}
