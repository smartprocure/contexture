import React, { useState } from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, Observer } from 'mobx-react'
import Flex from '../layout/Flex'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

let SelectAll = _.flow(observer, withTheme)(({ node, tree, theme: { Checkbox } }) => {
  let missingOptions = _.difference(
    _.map('name', _.get('context.options', node)),
    node.values
  )
  let allSelected = _.isEmpty(missingOptions)
  return (
    <label
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
      }}
    >
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
    </label>
  )
})
SelectAll.displayName = 'SelectAll'

let FacetOptionsFilter = ({ tree, node, theme: { Input, Button } }) => {
  let [val, setVal] = useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <Observer>
      {() => (
        <Flex>
          <Input
            value={val}
            onChange={e => {
              setVal(e.target.value)
            }}
            onKeyPress={e => e.key === 'Enter' && submit()}
            onBlur={submit}
            placeholder="Find..."
          />
          <Button
            style={{ display: buttonEnabled ? 'block' : 'none' }}
            onClick={submit}
          >
            Submit
          </Button>
        </Flex>
      )}
    </Observer>
  )
}

let Facet =
  ({
    tree,
    node,
    hide = {},
    theme: { Checkbox, RadioList },
    display = x => x,
    displayBlank = () => <i>Not Specified</i>,
    formatCount = x => x,
  }) => (
    <div className="contexture-facet">
      <RadioList
        value={node.mode || 'include'} // Fix by changing defaults in client example type
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
      />
      {!hide.facetFilter && (
        <FacetOptionsFilter
          tree={tree}
          node={node}
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
              alignItems: 'center',
              display: 'flex',
              cursor: 'pointer',
            }}
            title={`${display(name)} : ${formatCount(count)}`}
          >
            <Checkbox {...F.domLens.checkboxValues(name, lens)} />
            <div style={{ flex: 2, padding: '0 5px' }}>
              {display(name) || displayBlank()}
            </div>
            <div>{formatCount(count)}</div>
          </label>
        )
      }, _.get('context.options', node))}
      <Flex
        className="contexture-facet-cardinality"
        style={{ justifyContent: 'space-between' }}
      >
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

export default _.flow(contexturify, withTheme)(Facet)
