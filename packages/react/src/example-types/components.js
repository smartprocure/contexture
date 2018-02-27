import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import {observer, inject} from 'mobx-react'
import {Flex} from './Flex'

// For futil-js
let toggleElement = (check, val, arr) => (check ? _.pull : F.push)(val, arr)

export let Styles = () => (
  <style>
{`.contexture-search-box:focus {
  background: rgba(255, 255, 255, 1);
  outline: none;
}
.contexture-search-box {
  background: rgba(255, 255, 255, 0.7);
  transition: background 0.3s;
 
  margin: 0 auto;
  border-radius: 30px;
  border: 0;
  display: block;
  text-indent: 5px;
  padding: 5px;
  
  width: 100%;
  box-sizing: border-box;
}`}
  </style>
)

export let InjectTreeNode = inject(({tree: t1}, {tree = t1, path}) => ({
  tree,
  node: tree.getNode(path),
}))

export let Facet = InjectTreeNode(
  observer(({tree, node, hide = {}, ...props}) => (
    <div {...props}>
      {!hide.facetFilter && (
        <input
          className="contexture-search-box"
          type="text"
          value={node.optionsFilter}
          onChange={e =>
            tree.mutate(node.path, {optionsFilter: e.target.value})
          }
          placeholder="Find..."
        />
      )}
      {_.map(({name, count}) => {
        let checked = _.includes(name, node.values)
        return (
          <Flex
            key={name}
            style={{justifyContent: 'space-between', alignItems: 'baseline'}}>
            <input
              type="checkbox"
              onChange={() => {
                tree.mutate(node.path, {
                  values: toggleElement(checked, name, node.values),
                })
              }}
              checked={checked}
            />
            <div style={{flex: 2, paddingLeft: '5px', paddingRight: '5px'}}>
              {name}
            </div>
            <div>{count}</div>
          </Flex>
        )
      }, _.get('context.options', node))}
    </div>
  ))
)

export let Range = InjectTreeNode(
  observer(({tree, node, ...props}) => (
    <Flex {...props}>
      <input
        className="contexture-search-box"
        type="number"
        value={node.min}
        onChange={e => tree.mutate(node.path, {min: e.target.value})}
      />
      <div>-</div>
      <input
        className="contexture-search-box"
        type="number"
        value={node.max}
        onChange={e => tree.mutate(node.path, {max: e.target.value})}
      />
    </Flex>
  ))
)

export let Query = InjectTreeNode(
  observer(({tree, node, style, ...props}) => (
    <input
      className="contexture-search-box"
      style={{padding: '15px', ...style}}
      value={node.query}
      onChange={e =>
        tree.mutate(node.path, {
          query: e.target.value,
        })
      }
      placeholder="Search"
      {...props}
    />
  ))
)

export let ResultCount = InjectTreeNode(
  observer(({node, ...props}) => (
    <div style={{textAlign: 'center'}} {...props}>
      {node.context.response.results.length
        ? `Viewing records ${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </div>
  ))
)

export let DateHistogram = InjectTreeNode(
  observer(({node, format=_.identity, height = 100, background = () => '#ccc'}) => {
    let max = _.get('count', _.maxBy('count', node.context.entries))
    return (
      <Flex style={{alignItems: 'baseline', justifyContent: 'center'}}>
        {_.map(
          x => (
            <div key={x.key}>
              <div
                style={{
                  height: x.count / max * height,
                  background: background(x, max),
                }}
              />
              <div style={{padding: '5px'}}>{format(x.key)}</div>
            </div>
          ),
          node.context.entries
        )}
      </Flex>
    )
  })
)
