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
  hide = {},
  isMulti = true,
  display = x => x,
  formatCount = x => x,
  displayBlank = () => <i>Not Specified</i>,
  theme: { RadioList },
}) => (
  <div className="contexture-facet-select">
    {!hide.modeToggle && (
      <RadioList
        value={node.mode || 'include'}
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
      />
    )}
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
  </div>
)

export default contexturify(FacetSelect)
