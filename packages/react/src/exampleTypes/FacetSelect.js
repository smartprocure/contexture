import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { Flex } from '../greyVest'
import { contexturify } from '../utils/hoc'
import Async from 'react-select/lib/Async'

let getOptions = node =>
  _.map(
    ({ name, count }) => ({ ...F.autoLabelOption(name), count }),
    _.get('context.options', node)
  )

let FacetSelect = ({
  tree,
  node,
  isMulti = true,
  display = x => x,
  formatCount = x => x,
  displayBlank = () => <i>Not Specified</i>,
}) => (
  <Async
    placeholder="Search..."
    isMulti={isMulti}
    cacheOptions
    defaultOptions={getOptions(node)}
    loadOptions={async val => {
      await tree.mutate(node.path, { optionsFilter: val })
      return getOptions(node)
    }}
    formatOptionLabel={({ label, count }, { context }) =>
      context === 'menu' ? (
        <Flex justifyContent="space-between">
          {display(label) || displayBlank()}
          <span>{formatCount(count)}</span>
        </Flex>
      ) : (
        <span>
          {display(label) || displayBlank()} ({formatCount(count)})
        </span>
      )
    }
    onChange={x => tree.mutate(node.path, { values: _.map('value', x) })}
  />
)

export default contexturify(FacetSelect)
