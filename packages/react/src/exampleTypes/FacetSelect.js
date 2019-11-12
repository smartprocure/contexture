import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import Async from 'react-select/lib/Async'
import { components } from 'react-select'
import { Flex } from '../greyVest'
import { contexturify } from '../utils/hoc'
import { Cardinality } from './Facet'

let getOptions = node =>
  _.map(
    ({ name, count }) => ({ ...F.autoLabelOption(name), count }),
    _.get('context.options', node)
  )

let FacetSelect = ({
  tree,
  node,
  hide = {
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  singleValue = false,
  display = x => x,
  formatCount = x => x,
  displayBlank = () => <i>Not Specified</i>,
  theme: { RadioList },
}) => {
  let MenuList = props => (
    <components.MenuList {...props}>
      {!!node.context.cardinality && (
        <div
          style={{
            boxShadow: '0 2px 2px -2px #CCC',
            fontSize: '0.9em',
            padding: '0 10px 1px',
            marginBottom: 4,
            opacity: 0.8,
          }}
        >
          <Cardinality {...{ node, tree }} />
        </div>
      )}
      {props.children}
    </components.MenuList>
  )

  return (
    <div className="contexture-facet-select">
      <RadioList
        value={node.mode || 'include'}
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
      />
      <Async
        placeholder="Search..."
        isMulti={!singleValue}
        cacheOptions
        defaultOptions={getOptions(node)}
        loadOptions={async val => {
          await tree.mutate(node.path, { optionsFilter: val })
          return getOptions(node)
        }}
        formatOptionLabel={({ label, count }, { context }) => (
          <Flex justifyContent="space-between">
            <span>{display(label) || displayBlank()}</span>
            {context === 'menu' && !hide.counts && (
              <span>{formatCount(count)}</span>
            )}
          </Flex>
        )}
        onChange={x => tree.mutate(node.path, { values: _.map('value', x) })}
        components={{ MenuList }}
      />
    </div>
  )
}

export default contexturify(FacetSelect)
