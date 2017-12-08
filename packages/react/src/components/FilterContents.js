import _ from 'lodash/fp'
import React from 'react'
import { Component } from '../mobx-react-utils'

let FilterContents = ({ node, root, fields }) => {
  let type = root.types[node.type] || {}
  let TypeComponent = type.Component

  return (
    <div style={{ lineHeight: '30px', minHeight: '34px' }}>
      <select
        onChange={x => {
          node.field = x.target.value
        }}
      >
        {fields ? (
          _.map(
            x => (
              <option key={x.value || x} value={x.value || x}>
                {x.label || x}
              </option>
            ),
            fields
          )
        ) : (
          <option>Select a Field</option>
        )}
      </select>
      <select
        onChange={({ target: { value } }) => {
          root.typeChange(root.types, node, value)
        }}
        value={node.type}
      >
        {_.map(
          x => (
            <option key={x} value={x}>
              {root.types[x].label || _.capitalize(x)}
            </option>
          ),
          _.keys(root.types)
        )}
      </select>
      {node.key}
      {TypeComponent && (
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <TypeComponent {...{ node, root }} />
        </div>
      )}
      {JSON.stringify(node)}
      {/*new Date().toString()*/}
    </div>
  )
}

export default Component(FilterContents)
// TODO: schema field type options
