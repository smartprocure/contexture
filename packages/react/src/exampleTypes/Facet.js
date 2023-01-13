import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import { contexturify } from '../utils/hoc.js'
import { toNumber } from '../utils/format.js'
import {
  displayFn,
  displayBlankFn,
  SelectAll,
  Cardinality,
  FacetCheckboxList,
  FacetOptionsFilter,
} from '../utils/facet.js'

// The hard limit to how many checked values we can allow in a facet
let maxChecked = 500
// The number of items selected after which we will show the warning message
let warningCheck = 250

let Facet = ({
  tree,
  node,
  hide = {
    selectAll: false, // Hide the initial "Select All" checkbox
    radioList: false, // Hide the Include/Exclude radio list
    facetFilter: false, // Hide the search box above the facet checkboxes
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
  theme: { RadioList },
}) => {
  let valuesChecked = _.size(node.values)
  return (
    <div className="contexture-facet" data-path={node.path}>
      {valuesChecked > warningCheck && (
        <span>
          You have selected more than 250 items for this filter. Please consider
          using a different <b>filter type</b> or contact support for more
          search options. You will not be able to select more than 500 items
          maximum.
        </span>
      )}
      {!hide.radioList && (
        <RadioList
          value={node.mode || 'include'} // Fix by changing defaults in client example type
          onChange={mode => tree.mutate(node.path, { mode })}
          options={F.autoLabelOptions(['include', 'exclude'])}
        />
      )}
      {!hide.facetFilter && <FacetOptionsFilter tree={tree} node={node} />}
      {!hide.selectAll && (
        <SelectAll node={node} tree={tree} maxChecked={maxChecked} />
      )}
      <FacetCheckboxList
        tree={tree}
        node={node}
        hide={hide}
        display={display}
        displayBlank={displayBlank}
        formatCount={formatCount}
      />
      <Cardinality {...{ node, tree }} />
    </div>
  )
}

export default contexturify(Facet)
