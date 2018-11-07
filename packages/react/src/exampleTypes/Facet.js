import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'

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
      display = x => x,
      displayBlank = () => <i>Not Specified</i>,
      formatCount = x => x
    }) => (
      <div className="contexture-facet">
        <RadioList
          value={node.mode || 'include'} // Fix by changing defaults in client example type
          onChange={mode => tree.mutate(node.path, { mode })}
          options={F.autoLabelOptions(['include', 'exclude'])}
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
          let lens = tree.lens(node.path, 'values')
          return (
            <label
              key={name}
              style={{
                justifyContent: 'space-between',
                alignItems: 'baseline',
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <Checkbox {...F.domLens.checkboxValues(name, lens)} />
              <div style={{ flex: 2, padding: '0 5px' }}>
                {display(name) || displayBlank()}
              </div>
              <div>{formatCount(count)}</div>
            </label>
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
