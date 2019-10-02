import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'
import Async from 'react-select/lib/Async'

let getOptions = node =>
  _.map(({ name }) => F.autoLabelOption(name), node.context.options)

let FacetSelect = ({ tree, node, isMulti = true }) => (
  <Async
    isMulti={isMulti}
    cacheOptions
    defaultOptions={getOptions(node)}
    loadOptions={async val => {
      await tree.mutate(node.path, { optionsFilter: val })
      return getOptions(node)
    }}
    onChange={x => tree.mutate(node.path, { values: _.map('value', x) })}
  />
)

export default contexturify(FacetSelect)
