import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'

// For futil-js
let toggleElement = (check, val, arr = []) =>
  (check ? _.pull : F.push)(val, arr)

let CheckboxDefault = props => <input type="checkbox" {...props} />
let RadioListDefault = ({ value, onChange, options }) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      x => (
        <label key={x.value} onClick={() => onChange(x.value)}>
          <input type="radio" checked={x.value === value} onChange={() => {}} />
          {x.label}
        </label>
      ),
      options
    )}
  </Flex>
)

let SelectAll = observer(({ node, tree, Checkbox }) => {
  let missingOptions = _.difference(
    _.map('name', _.get('context.options', node)),
    node.values
  )
  let allSelected = _.isEmpty(missingOptions)
  return (
    <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Checkbox
        checked={allSelected}
        onChange={() => {
          if (allSelected)
            tree.mutate(node.path, {
              values: [],
            })
          else
            tree.mutate(node.path, {
              values: node.values.concat(missingOptions),
            })
        }}
      />
      <div style={{ flex: 2, padding: '0 5px' }}>Select All</div>
    </Flex>
  )
})
let Facet = injectTreeNode(
  observer(
    ({
      tree,
      node,
      hide = {},
      TextInput = 'input',
      Checkbox = CheckboxDefault,
      RadioList = RadioListDefault,
    }) => (
      <div className="contexture-facet">
        <RadioList
          value={node.mode || 'include'} // Fix by changing defaults in client example type
          onChange={mode => tree.mutate(node.path, { mode })}
          options={[
            {
              label: 'Include',
              value: 'include',
            },
            {
              label: 'Exclude',
              value: 'exclude',
            },
          ]}
        />
        {!hide.facetFilter && (
          <TextInput
            value={node.optionsFilter}
            onChange={e =>
              tree.mutate(node.path, { optionsFilter: e.target.value })
            }
            placeholder="Find..."
          />
        )}
        <SelectAll node={node} tree={tree} Checkbox={Checkbox} />
        {_.map(({ name, count }) => {
          let checked = _.includes(name, node.values)
          let toggle = () => {
            tree.mutate(node.path, {
              values: toggleElement(checked, name, node.values),
            })
          }
          return (
            <Flex
              key={name}
              style={{
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Checkbox onChange={toggle} checked={checked} />
              <div style={{ flex: 2, padding: '0 5px' }} onClick={toggle}>
                {name}
              </div>
              <div>{count}</div>
            </Flex>
          )
        }, _.get('context.options', node))}
        <Flex style={{ justifyContent: 'space-between', margin: '5px 0' }}>
          {!!node.context.cardinality && (
            <div>
              Showing {_.min([node.size || 10, node.context.options.length])} of{' '}
              {node.context.cardinality}
            </div>
          )}
          {node.context.cardinality > (node.size || 10) && (
            <div>
              <a
                onClick={() =>
                  tree.mutate(node.path, { size: (node.size || 10) + 10 })
                }
                style={{ cursor: 'pointer' }}
              >
                View More
              </a>
            </div>
          )}
        </Flex>
      </div>
    )
  ),
  exampleTypes.facet
)
Facet.displayName = 'Facet'

export default Facet
